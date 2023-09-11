import {
    PangeaConfig,
    VaultService,
    PangeaErrors,
    AuditService,
} from "pangea-node-sdk";
import dotenv from 'dotenv';
dotenv.config();

const Vaulttoken = process.env.PANGEA_VAULTTOKEN;
const Audittoken = process.env.PANGEA_AUDITTOKEN;
const Vaultconfig = new PangeaConfig({
    domain: process.env.PANGEA_DOMAIN,
    configID: process.env.PANGEA_VAULTCONFIGID
});
const AuditConfig = new PangeaConfig({
    domain: process.env.PANGEA_DOMAIN,
    configID: process.env.PANGEA_AUDITCONFIGID
});
const vault = new VaultService(Vaulttoken, Vaultconfig);
const audit = new AuditService(Audittoken, AuditConfig);

export { vault, PangeaErrors, audit };
