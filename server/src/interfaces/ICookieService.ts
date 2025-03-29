import { Response } from "express"; 

export interface ICookieHandlerService {
     setCookie(
            res: Response,
            accessToken: string
        ): void ;

        clearCookie(
                res: Response
            ): void;
}