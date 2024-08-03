import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const creaeCookies = asyncHandler(async (req, res, next) => {
    res.status(200)
        .cookie('name', 'value', { httpOnly: true, maxAge: 3600000 })
        .cookie('KEYrefreshToken', 'refreshToken')
        .json(
            new ApiResponse(
                200,
                "TEST creaeCookies",
                "TEST creaeCookies"
            )
        );
})

export {
    creaeCookies
}