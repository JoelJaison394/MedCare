import { vault,audit } from "../pangeaConfig.js";
import { prisma } from "../prismaConfig.js";
import logger from "../logger.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const auditController = {
  getauditDetails: async (req, res) => {
    try {
      const token = req.cookies.jwtToken;
      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
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

      const auditLogs = await prisma.auditLog.findMany({
        where: {
          userId: userId,
        },
      });

      res.status(200).json({ auditLogs });
    } catch (error) {
      console.error(error);
      logger.error("Error while retreving audit log:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default auditController;
