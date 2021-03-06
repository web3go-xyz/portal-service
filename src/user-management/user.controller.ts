import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfo } from 'src/viewModel/UserManagement/UserInfo';
import { UserSignupRequest } from 'src/viewModel/UserManagement/UserSignupRequest';
import { UserSigninRequest } from 'src/viewModel/UserManagement/UserSigninRequest';
import { ChangePasswordRequest } from 'src/viewModel/UserManagement/ChangePasswordRequest';
import { CodeVerifyRequest } from 'src/viewModel/UserManagement/CodeVerifyRequest';
import { EmailVerifyRequest } from 'src/viewModel/UserManagement/EmailVerifyRequest';
import { UserInfoUpdateRequest } from 'src/viewModel/UserManagement/UserInfoUpdateRequest';
import { UserFavorite } from 'src/common/entity/UserManagementModule/UserFavorite.entity';
import { LocalAuthGuard } from 'src/common/auth/LocalAuthGuard';
import { JwtAuthGuard } from 'src/common/auth/JwtAuthGuard';
import { Mailer } from 'src/email-support/Mailer';
import { UserFavoriteRemoveRequest } from 'src/viewModel/UserManagement/UserFavoriteRemoveRequest';
import { AuthUser } from 'src/common/auth/authUser';
import { UserAddressBundle } from 'src/common/entity/UserManagementModule/UserAddressBundle.entity';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // API for registering a new user account
  @Post('/signup')
  @ApiOperation({ summary: '[Web2] create new user account' })
  @ApiOkResponse({ type: UserInfo })
  async signup(@Body() request: UserSignupRequest): Promise<UserInfo> {

    let ifExist: boolean = await this.userService.checkEmailExist(request.email);
    if (ifExist) {
      throw new BadRequestException("the email has existed, you can try another email account or just signin with current email account");
    }

    let userInfo: UserInfo = await this.userService.createAccount(request);
    return userInfo;
  }

  // API for logging in a user
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @ApiOperation({ summary: '[Web2] login in , return user info and access token' })
  @ApiOkResponse()
  async signin(@Body() request: UserSigninRequest, @Request() req): Promise<any> {
    // console.log(request);
    // console.log(req.user);
    let validateUser: AuthUser = req.user;
    validateUser.username = request.username;
    let token = await this.userService.grantToken(validateUser);
    if (token) {
      validateUser.token = token;
    }
    return validateUser;
  }

  // API for retriving user info by Id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/getUserInfo')
  @ApiOperation({
    summary: 'get current user info',
    description: 'add [Authorization] in http header. Format:  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..." '
  })
  @ApiOkResponse({ type: UserInfo })
  async getUserInfo(@Request() request): Promise<UserInfo> {
    // console.log(request);
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.getUserInfo(userId);
  }

  // API for updating target user info by user Id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/updateUserInfo')
  @ApiOperation({ summary: 'update current user info' })
  @ApiOkResponse({ type: UserInfo })
  async updateUserInfo(@Body() request: UserInfoUpdateRequest, @Request() req): Promise<UserInfo> {
    return await this.userService.updateUserInfo(request);
  }

  // API for verifying a user email
  @Post('/verifyEmail')
  @ApiOperation({ summary: '[Web2] verify email if valid, will return userInfo , then the service will send an email contains the code.' })
  @ApiOkResponse({ type: UserInfo })
  async verifyEmail(@Body() request: EmailVerifyRequest): Promise<UserInfo> {
    return await this.userService.verifyEmail(request);
  }

  // API for verifying if user entered correct code
  @Post('/verifyCode')
  @ApiOperation({ summary: '[Web2] verify code if valid' })
  @ApiOkResponse({ type: Boolean })
  async verifyCode(@Body() request: CodeVerifyRequest): Promise<boolean> {
    return await this.userService.verifyCode(request);
  }

  // API for changing a user's password
  @Post('/changePassword')
  @ApiOperation({ summary: '[Web2] change password' })
  @ApiOkResponse({ type: Boolean })
  async changePassword(@Body() request: ChangePasswordRequest): Promise<boolean> {
    return await this.userService.changePassword(request);
  }

  // API for retriving a list of user's favorite databoards info
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/getUserFavorite')
  @ApiOperation({ summary: 'get favorite data card list' })
  @ApiOkResponse({ type: UserFavorite, isArray: true })
  async getUserFavorite(@Request() request): Promise<UserFavorite[]> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.getUserFavorite(userId);
  }

  // API for adding a databoard to the target user's favorite list
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/addFavorite')
  @ApiOperation({ summary: 'add data card into my favorite' })
  @ApiOkResponse({ type: UserFavorite, isArray: true })
  async addFavorite(@Body() req: UserFavorite, @Request() request): Promise<number> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.addFavorite(userId, req);
  }

  // API for removing a databoard from the target user's favorite list
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/removeFavorite')
  @ApiOperation({ summary: 'remove favorite link' })
  @ApiOkResponse({ type: UserFavoriteRemoveRequest, isArray: true })
  async removeFavorite(@Body() req: UserFavoriteRemoveRequest, @Request() request): Promise<number> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.removeFavorite(userId, req);
  }

  //@Post('/testEmail')
  testEmail() {
    let mailer = new Mailer();
    mailer.send({
      to: 'byj626680108@gmail.com',
      subject: 'verification from web3go',
      html: '<p> hi byj, <br>your are going to reset the password , below is the verification code:<br><h1>123456</h1><br> sent by web3go</p>'
    });
    return "email sent success";

  }
  //@Post('/testCode')
  testCode() {
    return this.userService.generateCode(6);
  }


  // API for retriving the list of user-address bundles by user Id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/getAddressBundle')
  @ApiOperation({
    summary: 'get current user bundled address list'
  })
  @ApiOkResponse({ type: UserAddressBundle, isArray: true })
  async getAddressBundle(@Request() request): Promise<UserAddressBundle[]> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.getAddressBundle(userId);
  }

  // API for adding a new user-address bundles with userId and address data
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/addAddressBundle')
  @ApiOperation({
    summary: 'add new address into bundled address list'
  })
  @ApiOkResponse({ type: UserAddressBundle, isArray: false })
  async addAddressBundle(@Body() data: UserAddressBundle, @Request() request): Promise<UserAddressBundle> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.addAddressBundle(userId, data);
  }

  // API for removing a user-address bundle from userId bundled address list
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/removeAddressBundle')
  @ApiOperation({
    summary: 'remove address from bundled address list'
  })
  @ApiOkResponse({ type: Boolean })
  async removeAddressBundle(@Body() data: UserAddressBundle, @Request() request): Promise<Boolean> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userService.removeAddressBundle(userId, data);
  }
}

