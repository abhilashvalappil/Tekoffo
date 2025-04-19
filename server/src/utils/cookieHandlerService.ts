import { Response } from "express";

export class CookieHandlerService {
    public setCookie(
        res: Response,
        accessToken: string
    ): void {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            // sameSite: "strict",
            sameSite: 'lax',
            maxAge: 59 * 60 * 1000
        });
    }

    public clearCookie(
        res: Response
    ): void {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            // sameSite: "strict",
            sameSite: 'lax',
            path: "/"
        });
    }
}