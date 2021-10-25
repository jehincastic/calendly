import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";

import Button from "@components/Button";
import { AccountDisplay } from "@interfaces/index";
import { capitalizeFirstLetter } from "@utils/index";
import description from "@config/providerDesc";
import { useAuth } from "@providers/AuthProvider";
import { LoadingContext } from "@providers/LoadingProvider";

interface AccountsListCardProps {
  account: AccountDisplay;
}

const AccountListCard: React.FC<AccountsListCardProps> = ({
  account,
}) => {
  const { user } = useAuth();
  const { isLoading } = React.useContext(LoadingContext);
  const router = useRouter();

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {account.name}
        </Typography>
        <Typography variant="h6" component="div">
          {capitalizeFirstLetter(account.providerType.toLowerCase())}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {account.email}
        </Typography>
        <Typography variant="body2">
          {description[account.providerType.toLowerCase()]}
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            loading={user.loading || isLoading}
            size="small"
          >
            View Config
          </Button>
          <Button
            loading={user.loading || isLoading}
            onClick={() => {
              router.push(`/accounts/calendar/${account.id}`);
            }}
            size="small"
          >
            View Calendar
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default AccountListCard;
