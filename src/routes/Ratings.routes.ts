import { Router } from "express";
import RatingsController from "../controllers/Ratings.controller";
import Ensuraces from "../middlewares/Ensures.middleware";
import { schemaCreateRating } from "../serializers/Ratings.serializer";

export const ratingsRouter = Router()

ratingsRouter.post("/movies/:id/ratings",
    Ensuraces.validIdParams,
    Ensuraces.authentication, 
    Ensuraces.serializerData(schemaCreateRating),
    RatingsController.postUserRatingsOfaMovieController
)

ratingsRouter.post("/series/:id/ratings",
    Ensuraces.validIdParams,
    Ensuraces.authentication, 
    Ensuraces.serializerData(schemaCreateRating),
    RatingsController.postUserRatingsOfaSerieController
)

ratingsRouter.get('/ratings/movies', 
    RatingsController.readAllRatingsMoviesController
)

ratingsRouter.get('/ratings/series',
    RatingsController.readAllRatingsSeriesController
)

ratingsRouter.get('/ratings/:movieId',
    Ensuraces.validMovieIdParams,
    RatingsController.listUserRatingsOfaMovieController
)
ratingsRouter.get('/ratings/:serieId',
    Ensuraces.validSerieIdParams,
    RatingsController.listUserRatingsOfaSerieController 
)
ratingsRouter.delete('/ratings/:movieId/:userId',
    Ensuraces.validMovieIdParams,
    Ensuraces.validUserIdParams,
    Ensuraces.authentication,
    RatingsController.deleteMovieRatingController
)
ratingsRouter.delete('/ratings/:serieId/:userId',
    Ensuraces.validSerieIdParams,
    Ensuraces.validUserIdParams,
    Ensuraces.authentication,
    RatingsController.deleteSerieRatingController
)
