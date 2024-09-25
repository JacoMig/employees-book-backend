import { UserGroup } from "../userSchema"

export type AuthUser = {
    id: string,
    userGroup: UserGroup,
    username: string
}
