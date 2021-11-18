import {Response} from "express";

export function sendResponse(response: Response, message: string, status: number = 200) {
    response.status(status).send({
        message: message
    })
}

