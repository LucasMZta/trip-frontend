import { ZodError } from "zod";

export type ErrorItem = { field: string; message: string; }

export const getErrorFromZod = (error: ZodError) => {
    const errorList: ErrorItem[] = [];
    for (const i in error.errors) {
        errorList.push({
            field: error.errors[i].path[0].toString(),
            message: error.errors[i].message
        })
        // console.log(error.errors[i].path[0].toString())
        // console.log(error.errors[i].message)
    }
    return errorList;
}