import { dateToEpoch } from "@utils/dbUtils";
import { environment } from "@utils/environment";

interface PasscodeInfo {
    passcode: number,
    expirationDate: Date
}

export class AuthService
{
    static _instance: AuthService;
    // Map stablish a relationship between an email and its data (passcode and date of expiry)
    private userPasscodes: Map<string, PasscodeInfo> = new Map();

    private constructor() { 
        setInterval(() => { this.checkPasscodeExpiration() },  environment.auth.expiratedPasscodesChecking*1000*60);
    }

    public static getInstance(): AuthService {
        if (!AuthService._instance) {
            AuthService._instance = new AuthService();
        }

        return AuthService._instance;
    }

    public generateLoginPasscode(email: string): number
    {
        // Generate a temporary response token and store it for 10 minutes
        let expiryDate: Date = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + environment.auth.passcodeExpiration);

        let passcodeInfo: PasscodeInfo = {
            passcode: Math.floor(100000 + Math.random() * 900000),
            expirationDate: expiryDate
        }

        this.userPasscodes.set(email, passcodeInfo);
        
        return passcodeInfo.passcode;
    }

    public validatePasscode(email: string, passcode: number): boolean
    {
        if(!this.userPasscodes.has(email)) return false;
        
        if(this.userPasscodes.get(email)!.passcode == passcode) {
            this.userPasscodes.delete(email);
            return true;
        }

        return false;
    }

    private checkPasscodeExpiration()
    {
        this.userPasscodes.forEach((value, key) => {
            if(value.expirationDate <= new Date()){
                this.userPasscodes.delete(key);
            }
        });
    }
}