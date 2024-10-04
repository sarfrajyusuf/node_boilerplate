import { insertBlockchainData } from "./db/blockchain";
import { insertCrossChainPlatformData } from "./db/crosschainPlatform";
import { insertRampsData } from "./db/ramp"
// Execute the function to insert data
insertBlockchainData();
insertCrossChainPlatformData()
insertRampsData()
