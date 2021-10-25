import type { NextPage } from "next";

import withNavBar from "@hocs/withNavBar";
import { useAuth } from "@providers/AuthProvider";
import NotLoggedIn from "@components/NotLoggedIn";
import LoggedIn from "@components/LoggedIn";


const Home: NextPage = () => {
  const { user } = useAuth();
  if (user.loading) {
    return <></>;
  }
  if (user.loggedIn) {
    return <LoggedIn />
  } else {
    return <NotLoggedIn />
  }
}

export default withNavBar(Home);
