import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/auth/JwtAuthGuard';
import { AuthUser } from 'src/common/auth/authUser';
import { MyLogger } from 'src/common/log/logger.service';
import { Web3SignInNonceRequest } from './web3.signin/model/Web3SignInNonceRequest';
import { Web3SignInNonceResponse } from './web3.signin/model/Web3SignInNonceResponse';
import { Web3SignInChallengeRequest } from './web3.signin/model/Web3SignInChallengeRequest';
import { Web3SignInChallengeResponse } from './web3.signin/model/Web3SignInChallengeResponse';
import { Web3SignInHelper } from './web3.signin/Web3SignInHelper';
import { KVService } from 'src/common/kv/kv.service';
const { v4: uuidv4 } = require('uuid');

@Controller('/user')
@ApiTags('web3-sign-in')
export class Web3SignInController {

  constructor(private readonly userService: UserService,
    private readonly web3SignInHelper: Web3SignInHelper,
    private kvService: KVService,) { }


  @Post('/web3_nonce')
  @ApiOperation({ summary: '[Web3] create a nonce message for signin request' })
  @ApiOkResponse({ type: Web3SignInNonceResponse })
  async nonce(@Body() request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {

    let nonce = 'web3-signin-' + new Date().getTime() + '-' + uuidv4().substring(0, 6);
    let challenge = "challenge message to signin at " + new Date().toISOString();
    let resp = await this.web3SignInHelper.createChallenge(request, challenge, nonce)

    let expireSeconds = 120;
    this.kvService.set(nonce, JSON.stringify(resp), expireSeconds);

    return resp;
  }

  @Post('/web3_challenge')
  @ApiOperation({ summary: '[Web3] verify the nonce message and signature' })
  @ApiOkResponse({ type: Web3SignInChallengeResponse })
  async challenge(@Body() request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {
    try {

      let challenge = request.challenge;
      let nonce = request.nonce;
      if (!challenge) {
        throw new BadRequestException('challenge invalid');
      } if (!nonce) {
        throw new BadRequestException('nonce invalid');
      }

      //check nonce exist
      let nonceCache = await this.kvService.get(nonce);
      if (nonceCache) {

        //verify signature
        let resp = await this.web3SignInHelper.challenge(request);

        //remove nonce
        this.kvService.del(nonce);

        if (resp.verified) {
          //add user 
          let userName = request.address;
          let validateUser: AuthUser = await this.userService.checkWeb3User(userName);
          let token = await this.userService.grantToken(validateUser);
          if (token) {
            resp.extra = token;
          }
        }
        else {
          throw new BadRequestException('challenge failed');
        }
        return resp;
      } else {
        throw new BadRequestException('nonce not exist');
      }

    } catch (error) {
      MyLogger.error(error);
      throw new BadRequestException('request invalid, ' + error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/web3_sign_out')
  @ApiOperation({ summary: '[Web3] sign out from service side' })
  @ApiOkResponse({ type: Boolean })
  async sign_out(@Request() request): Promise<Boolean> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    MyLogger.verbose(`userId ${userId} sign out from service side`)
    return true;
  }

}

