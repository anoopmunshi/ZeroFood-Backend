import * as express from "express";
import { UserController } from './controller/UserController';
import { FoodCenterController } from "./controller/FoodCenterController";
import { AuthController } from "./controller/AuthController";
import { AuthMiddleware } from './middleware/AuthMiddleware';
const router = express.Router();

let userController = new UserController();
// User Endpoints
/** 
 * @api {get} /users/ Get All Users
 * @apiName GetUsers
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization Send valid auth token as Bearer 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer valid-token-from-login-response"
 *     }
 *
 * @apiSuccess {Object[]} users       List of users.
 * @apiSuccess {String}   user.id     User unique id.
 * @apiSuccess {String}   user.role   User role (USER or ADMIN).
 * @apiSuccess {String}   user.fullName Users full name.
 * @apiSuccess {String}   user.emailId Users email id.
 * @apiSuccess {String}   user.phoneNumber Users phone number.
 * @apiSuccess {String}   user.encryptedPassword Users encryptedPassword.
 */
router.get("/users", AuthMiddleware.validate, userController.getUsers);

/**
 * @api {post} /users/ Add a new User
 * @apiName AddUser
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization Send valid auth token as Bearer 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer valid-token-from-login-response"
 *     }
 * 
 * @apiParam (Request body) {Object} user  User object
 * @apiParam (Request body) {String} user.fullName Users full name.
 * @apiParam (Request body) {Sting} user.emailId Users email Id.
 * @apiParam (Request body) {String} user.phoneNumber Users phone number.
 * @apiParam (Request body) {String} user.password Users password.
 * 
 * @apiSuccess {Object}   user       Successfully added User.
 * @apiSuccess {String}   user.id     User unique id.
 * @apiSuccess {String}   user.role   User role (USER or ADMIN).
 * @apiSuccess {String}   user.fullName Users full name.
 * @apiSuccess {String}   user.emailId Users email id.
 * @apiSuccess {String}   user.phoneNumber Users phone number.
 * @apiSuccess {String}   user.encryptedPassword Users encryptedPassword.
 */
router.post("/users", AuthMiddleware.validate, userController.createUser);

// Authentication
let authController = new AuthController();
/**
 * @api {post} /login Login api
 * @apiName Login
 * @apiGroup Authentication
 * 
 * @apiParam (Request body) {Object} user  User object
 * @apiParam (Request body) {String} foodCenter.emailId Email Id of the user.
 * @apiParam (Request body) {Sting} foodCenter.password Password of the user.
 * 
 * @apiSuccess {Object}  authResponse Auth Token response.
 * @apiSuccess {String}   authResponse.token Valid auth token.
 * @apiSuccess {String}   authResponse.expiry Auth token expiry.
 * @apiSuccess {Object}   authResponse.user user details object.
 */
router.post("/login", authController.login);

// Food Centers
let foodCenterController = new FoodCenterController();
/** 
 * @api {get} /food-centers/ Get All or Search Food Centers
 * @apiName GetFoodCenters
 * @apiGroup Food Center
 *
 * @apiParam {String}   q   search query
 * @apiParam {String}   lat latitude
 * @apiParam {String}   long longitude
 * @apiParam {String}   radius radius
 * @apiParam {String}   status comma separated status ex: LISTED,UNLISTED,DELETED 
 * 
 * @apiSuccess {Object[]}  foodCenter List of all food centers.
 * @apiSuccess {String}   foodCenter.id Food Center Id.
 * @apiSuccess {String}   foodCenter.name Food Center Name.
 * @apiSuccess {String}   foodCenter.address Food Center Address.
 * @apiSuccess {String}   foodCenter.city City.
 * @apiSuccess {String}   foodCenter.state State.
 * @apiSuccess {Number}   foodCenter.capacity Food Center capacity.
 * @apiSuccess {Object}   foodCenter.location Location Object.
 * @apiSuccess {String}   foodCenter.location.type Location type.
 * @apiSuccess {Number[]} foodCenter.location.coordinates Array with longitude at 0 and latitude at 1 index.
 * @apiSuccess {String}   foodCenter.contactNumber Contact Number of the food organizer.
 * @apiSuccess {String}   foodCenter.status Status of the food center.
 * 
 */
router.get("/food-centers", foodCenterController.getFoodCenters);

/**
 * @api {post} /food-centers/ Add a new food center
 * @apiName AddFoodCenter
 * @apiGroup Food Center
 * 
 * @apiHeader {String} Authorization Send valid auth token as Bearer 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer valid-token-from-login-response"
 *     }
 * 
 * @apiParam (Request body) {Object} foodCenter  Food Center object
 * @apiParam (Request body) {String} foodCenter.name name.
 * @apiParam (Request body) {Sting} foodCenter.address Address.
 * @apiParam (Request body) {String} foodCenter.city City.
 * @apiParam (Request body) {String} foodCenter.state State.
 * @apiParam (Request body) {Number} foodCenter.capacity Capacity.
 * @apiParam (Request body) {Object} foodCenter.location Location Object.
 * @apiParam (Request body) {String} foodCenter.location.type Location Type - "Point".
 * @apiParam (Request body) {Number[]} foodCenter.location.coordinates Array of longitude, latitude ex: [long, lat].
 * @apiParam (Request body) {String} foodCenter.contactNumber Contact Number of the food organizer.
 * 
 * @apiSuccess {Object}  foodCenter Successfully added food center.
 * @apiSuccess {String}   foodCenter.id Food Center Id.
 * @apiSuccess {String}   foodCenter.name Food Center Name.
 * @apiSuccess {String}   foodCenter.address Food Center Address.
 * @apiSuccess {String}   foodCenter.city City.
 * @apiSuccess {String}   foodCenter.state State.
 * @apiSuccess {Number}   foodCenter.capacity Food Center capacity.
 * @apiSuccess {Object}   foodCenter.location Location Object.
 * @apiSuccess {String}   foodCenter.location.type Location type.
 * @apiSuccess {Number[]} foodCenter.location.coordinates Array with longitude at 0 and latitude at 1 index.
 * @apiSuccess {String}   foodCenter.contactNumber Contact Number of the food organizer.
 * @apiSuccess {String}   foodCenter.status Status of the food center.
 */
router.post("/food-centers", AuthMiddleware.validate, foodCenterController.addFoodCenter);

/**
 * @api {put} /food-centers/:id Update existing food center
 * @apiName UpdateFoodCenter
 * @apiGroup Food Center
 * 
 * @apiHeader {String} Authorization Send valid auth token as Bearer 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer valid-token-from-login-response"
 *     }
 * 
 * @apiParam {String} id Food Center id.
 * 
 * @apiParam (Request body) {Object} foodCenter  Food Center object
 * @apiParam (Request body) {String} foodCenter.name name.
 * @apiParam (Request body) {Sting} foodCenter.address Address.
 * @apiParam (Request body) {String} foodCenter.city City.
 * @apiParam (Request body) {String} foodCenter.state State.
 * @apiParam (Request body) {Number} foodCenter.capacity Capacity.
 * @apiParam (Request body) {Object} foodCenter.location Location Object.
 * @apiParam (Request body) {String} foodCenter.location.type Location Type - "Point".
 * @apiParam (Request body) {Number[]} foodCenter.location.coordinates Array of longitude, latitude ex: [long, lat].
 * @apiParam (Request body) {String} foodCenter.contactNumber Contact Number of the food organizer.
 * @apiParam (Request body) {String} foodCenter.status Status of the food center ex: LISTED or UNLISTED or DELETED.
 * 
 * @apiSuccess {Object}  foodCenter Successfully added food center.
 * @apiSuccess {String}   foodCenter.id Food Center Id.
 * @apiSuccess {String}   foodCenter.name Food Center Name.
 * @apiSuccess {String}   foodCenter.address Food Center Address.
 * @apiSuccess {String}   foodCenter.city City.
 * @apiSuccess {String}   foodCenter.state State.
 * @apiSuccess {Number}   foodCenter.capacity Food Center capacity.
 * @apiSuccess {Object}   foodCenter.location Location Object.
 * @apiSuccess {String}   foodCenter.location.type Location type.
 * @apiSuccess {Number[]} foodCenter.location.coordinates Array with longitude at 0 and latitude at 1 index.
 * @apiSuccess {String}   foodCenter.contactNumber Contact Number of the food organizer.
 * @apiSuccess {String}   foodCenter.status Status of the food center.
 */
router.put("/food-centers/:id", AuthMiddleware.validate, foodCenterController.updateFoodCenter);



/**
 * @api {put} /food-centers/count Get the count of Food Centers
 * @apiName FoodCenterCount
 * @apiGroup Food Center
 * 
 * @apiParam {String}   q   search query
 * @apiParam {String}   lat latitude
 * @apiParam {String}   long longitude
 * @apiParam {String}   radius radius
 * @apiParam {String}   status comma separated status ex: LISTED,UNLISTED,DELETED 
 * 
 * @apiSuccess {Object}  foodCenterCount Food centers count object.
 * @apiSuccess {Number}   foodCenterCount.count Count of food centers.
 */
router.get("/food-centers/count", foodCenterController.getFoodCenterCount);


export default router;