import { vault, audit, PangeaErrors } from "../pangeaConfig.js";
import { prisma } from "../prismaConfig.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const userController = {
  registerUsers: async (req, res) => {
    try {
      const {
        email,
        pangeaid,
        firstName,
        lastName,
        phoneNumber,
        profileImg,
        dateOfBirth,
        bio,
        password,
        address,
      } = req.body;
      // Validate required fields
      if (!email || !firstName || !lastName || !phoneNumber || !password) {
        return res.status(400).json({
          message:
            "Email, firstName, lastName, phoneNumber, and password are required.",
        });
      }

      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          pangeaid,
          phoneNumber,
          profileImg,
          dateOfBirth,
          bio,
          password,
          address: {
            create: {
              street: address.street,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
              country: address.country,
            },
          },
        },
      });

      // Generate a JWT token
      await vault.jwkGet(process.env.PANGEA_USERAUTH_JWTSECRECT);
      const payload = {
        sub: pangeaid,
        email: email,
        userID: newUser.id,
      };
      const jwtResponse = await vault.jwtSign(
        process.env.PANGEA_USERAUTH_JWTSECRECT,
        JSON.stringify(payload)
      );
      const signedJWT = jwtResponse.result.jws;

      const clientIp = req.ip;

      // Create a audit log
      const auditData = {
        action: "Account creation",
        actor: `${firstName} ${lastName}`,
        target: email,
        status: "success",
        message: `User created from the req - ${clientIp}`,
        source: "web",
      };

      const logResponse = await audit.log(auditData, { verbose: true });

      await prisma.auditLog.create({
        data: {
          action: "Account creation",
          actor: `${firstName} ${lastName}`,
          target: email,
          status: "success",
          message: `User created from the req - ${clientIp}`,
          source: "web",
          userId: newUser.id,
        },
      });

      const responsePayload = {
        message: "User registered successfully",
        user: newUser,
        token: signedJWT,
      };


      res
        .cookie("jwtToken", signedJWT, {
          secure: true,
          httpOnly: true,
          maxAge: 3600000,
        })
        .status(201)
        .json(responsePayload);
    } catch (error) {

      if (error instanceof PangeaErrors.APIError) {
        console.log(error.summary, error.pangeaResponse);
      }

      console.error(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getUserDetails: async (req, res) => {
    try {
      const token = req.cookies.jwtToken;

      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
      }

      const checkTokenResponse = await vault.jwtVerify(
        token,
        process.env.PANGEA_USERAUTH_JWTSECRECT
      );

      if (!checkTokenResponse.result.valid_signature) {
        return res.status(401).json({ message: "Invalid token signature" });
      }

      const Jwk = await vault.jwkGet(process.env.PANGEA_USERAUTH_JWTSECRECT);

      const publicKey = {
        alg: Jwk.result.keys[0].alg,
        crv: Jwk.result.keys[0].crv,
        kid: Jwk.result.keys[0].kid,
        x: Jwk.result.keys[0].x,
        y: Jwk.result.keys[0].y,
      };

      const decodedToken = jwt.decode(token, publicKey);

      const userId = decodedToken.userID;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getUserDetailsbyPangeaId: async (req, res) => {
    try {
      const pangeaId = req.params.pangeaId;
      const user = await prisma.user.findUnique({
        where: { pangeaid: pangeaId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const payload = {
        sub: user.pangeaid,
        email: user.email,
        userID: user.id,
      };
      const jwtResponse = await vault.jwtSign(
        process.env.PANGEA_USERAUTH_JWTSECRECT,
        JSON.stringify(payload)
      );
      const signedJWT = jwtResponse.result.jws;

      res
        .cookie("jwtToken", signedJWT, {
          // secure: true,
          httpOnly: true,
          maxAge: 3600000,
        })
        .status(200)
        .json({ user , signedJWT });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default userController;
