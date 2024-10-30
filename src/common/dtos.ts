import { Stream } from "stream"
import { UserGroup } from "../userSchema"

export type AuthUser = {
    id: string,
    userGroup: UserGroup,
    username: string
}



export type FileCV = {
    file: Stream | undefined,
    name?: string,
    type?: string,
    fieldname?: string
}
