import { TargetModel } from "./target-model";

export class GroupModel
{
    public uuid: string;
    public name: string;
    public description: string;
    public target_list: TargetModel[];
}