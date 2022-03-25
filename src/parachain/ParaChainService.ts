import { Injectable } from '@nestjs/common';
import { Keyring } from '@polkadot/keyring';
import { MyLogger } from 'src/common/log/logger.service';
import { paraChainAccountConfig } from 'src/parachain/paraChainConfig';

@Injectable()
export class ParaChainService {

    ss58transform(account: string, networks: string[]): any[] {
        MyLogger.log('account:' + account + 'network:' + networks.join(','));
        let keys = [];
        try {
            const keyring = new Keyring();
            const pair = keyring.addFromAddress(account);

            MyLogger.log('Substrate generic', pair.address);

            let publicKeys = keyring.getPublicKeys();

            if (publicKeys) {
                let publicKeysStr = '0x';

                publicKeysStr += this.Uint8ArrayToHexString(publicKeys[0]);

                // console.log('Public Key', publicKeys);
                keys.push({ key: 'Public Key', value: publicKeysStr });

            }

            if (paraChainAccountConfig) {

                paraChainAccountConfig.forEach(c => {

                    if (networks && networks.length > 0) {
                        if (networks.findIndex((v, index, obj) => {
                            return c.network.toLowerCase() === v.toLowerCase()
                        }) == -1) {
                            return;
                        }
                    }
                    keyring.setSS58Format(c.prefix);

                    let key = {
                        value: pair.address,
                        network: c.network,
                        prefix: c.prefix,
                        displayName: c.displayName
                    };
                    console.log("ss58transform key:", key);
                    keys.push(key);

                });

            }
        } catch (error) {
            keys.push({ error: true, msg: error });
        }

        return keys;
    }

    Uint8ArrayToHexString(d: Uint8Array) {
        let s = '';
        // console.log(d);
        d.forEach((p) => {
            // console.log(p);
            let v = parseInt(p.toString());
            let hexV = v.toString(16);
            if (hexV.length < 2) { hexV = '0' + hexV; }
            s += hexV;
        });

        return s;
    }


}
