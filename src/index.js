import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { handleUserSignUp, handleStoreAdd, handleAddReview, handleAddMission, handleStartMission, handleUpdateProfile } from "./controllers/user.controller.js";
import { errorHandler } from "./middleware/error-handler.js";
import { swaggerUi, specs } from "./config/swagger.config.js";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";


dotenv.config();
passport.use(googleStrategy);
passport.use(jwtStrategy);
const app = express();
const port = process.env.PORT;
const isLogin = passport.authenticate('jwt', { session: false });

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.patch("/api/v1/users/:userId/profile", isLogin, handleUpdateProfile);
app.post("/api/v1/store/add", isLogin, handleStoreAdd);
app.post("/api/v1/stores/:storeId/reviews", isLogin, handleAddReview);
app.post("/api/v1/stores/:storeId/missions", isLogin, handleAddMission);
app.post("/api/v1/users/:userId/missions/:missionId/start", isLogin, handleStartMission);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.get('/mypage', isLogin, (req, res) => {
  res.status(200).json({
    isSuccess: true,
    code: 200,
    message: `인증 성공! ${req.user?.name ?? "사용자"}님의 마이페이지입니다.`,
    result: { user: req.user },
  });
});
  
app.get("/oauth2/login/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const authData = req.user;

    res.status(200).json({
      isSuccess: true,
      code: 200,
      message: "Google 로그인 성공!",
      result: {
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: authData.user,
        isProfileComplete: authData.isProfileComplete,
      }
    });
  }
);