import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { AccountDisplay } from "@interfaces/index";
import AccountListCard from "@components/AccountListCard";
import Button from "@components/Button";

interface AccountsListProps {
  accounts: AccountDisplay[];
  handleOAuthLogin: (provider: string) => Promise<void>;
}

const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  handleOAuthLogin,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        spacing={4}
        container
        sx={{ mt: 2 }}
      >
        {
          accounts.map((ac, idx) => {
            return (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <AccountListCard account={ac} />
              </Grid>
            );
          })
        }
      </Grid>
      <Button
        sx={{
          mt: 2,
        }}
        onClick={() => handleOAuthLogin("google")}
      >
        Link A Google Account
      </Button>
    </Box>
  );
};

export default AccountsList;
