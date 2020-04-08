import { Repository, getRepository, UpdateResult } from "typeorm";
import { FoodCenter } from "../entity/FoodCenter";
import { FCStatus } from "../entity/FCStatus";
export class FoodCenterSearch {
    q?: string;
    lat?: string;
    long?: string;
    radius?: string;
    status?: FCStatus;
}

export class FoodCenterService {
    foodCenterRepository: Repository<FoodCenter>;

    constructor() {
        this.foodCenterRepository = getRepository(FoodCenter);
    }

    getAll(search: FoodCenterSearch): Promise<FoodCenter[]> {
        let queryOptions = this.formQueryOptions(search);
        return this.foodCenterRepository.find(queryOptions);
    }

    getByUserId(id: string): Promise<FoodCenter[]> {
        return this.foodCenterRepository.find({ "user": { "id": id } });
    }

    formQueryOptions(search: FoodCenterSearch): any {
        let query: any = {
            status: {
                $in: [FCStatus.LISTED]
            }
        };

        if (search.lat && search.long) {
            let radius: number = parseInt(search.radius ? search.radius : "5");
            query['location'] = {
                $geoWithin: {
                    $centerSphere: [[parseFloat(search.long), parseFloat(search.lat)], radius / 3963.2]
                }
            };
        } else {
            if (search.q)
                query['$or'] = [
                    { state: { $regex: ".*" + search.q + ".*", $options: "i" } },
                    { city: { $regex: ".*" + search.q + ".*", $options: "i" } },
                    { address: { $regex: ".*" + search.q + ".*", $options: "i" } }
                ];
        }

        if (search.status) {
            let statusArr = search.status.split(",");
            query.status["$in"] = statusArr;
        }

        console.log(JSON.stringify(query));
        return query;
    }

    getFoodCenterById(id: string): Promise<FoodCenter> {
        return this.foodCenterRepository.findOne({
            where: {
                id: id
            }
        });
    }

    saveFoodCenter(foodCenter: FoodCenter): Promise<FoodCenter> {
        if (foodCenter.location && foodCenter.location.coordinates) {
            let coord = foodCenter.location.coordinates;
            if (coord.length == 2) {
                foodCenter.long = coord[0];
                foodCenter.lat = coord[1];
            }
        }
        return this.foodCenterRepository.save(foodCenter);
    }

    updateFoodCenter(id: string, foodCenter: FoodCenter): Promise<UpdateResult> {
        return this.foodCenterRepository.update(id, foodCenter);
    }

    getFoodCenterCount(search: FoodCenterSearch): Promise<number> {
        let queryOptions = this.formQueryOptions(search);
        return this.foodCenterRepository.count(queryOptions);
    }

}