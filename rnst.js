#!/usr/bin/env node

require("child_process").execSync("react-native start server --transformer node_modules/react-native-sm-transformer/index",
  {
    stdio:[0,1,2]
  });