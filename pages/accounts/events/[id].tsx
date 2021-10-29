import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useFormik } from "formik";
import { add } from "date-fns";
import { EventType } from "@prisma/client";

import { LoadingContext } from "@providers/LoadingProvider";
import { AlertContext } from "@providers/AlertProvider";
import { useAuth } from "@providers/AuthProvider";
import withNavBar from "@hocs/withNavBar";
import { EventFormSubmit, EventsDisplayAll } from "@interfaces/index";
import fetcher from "@utils/fetcher";
import NoRecords from "@components/NoRecords";
import Button from "@components/Button";
import EventCreation from "@components/EventCreation";
import { getStartAndEndTime } from "@utils/index";
import eventSchema from "@schemas/event";
import EventsList from "@components/EventsList";

interface EventListProps {};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const EventsListPage: React.FC<EventListProps> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setLoading, isLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);
  const [loading, setLoadingComp] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [events, setEvents] = useState<EventsDisplayAll[]>([]);
  const [open, setOpen] = useState(false);

  const viewEvents = async (accountId: string) => {
    const {
      status,
      data,
    } = await fetcher<any, {data: EventsDisplayAll[], email: string}>(
      `/api/get-events/${accountId}`,
      "GET",
    );
    if (status === "FAILED") {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
      if (data === "Invalid Input") {
        await router.push("/")
      }
      return { data: [], email: "" };
    }
    return data as {data: EventsDisplayAll[], email: string};
  };

  const addEvent = async () => {
    handleClose();
  };

  useEffect(() => {
    if (!user.loggedIn && !user.loading) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      if (loading) {
        setLoading(true);
      }
    }
  }, [isLoading])

  useEffect(() => {
    setLoadingComp(true);
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const fetchToken = async () => {
    const { id: accountId } = router.query;
    if (typeof accountId === "string") {
      const { data, email } = await viewEvents(accountId);
      setEvents(data);
      setAccountEmail(email);
      setLoadingComp(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    timeMax,
    timeMin,
  } = getStartAndEndTime(
    user.timezone,
    add(new Date(), {
      days: 1,
    }),
    15,
  );

  const formik = useFormik<EventFormSubmit>({
    initialValues: {
      name: "",
      link: "",
      description: "",
      type: EventType.GMEET,
      isPrivate: false,
      password: "",
      isApprovalRequired: false,
      duration: 15,
      durationVal: "min",
      typeInfo: {},
      dateRange: [timeMin, timeMax],
      scheduleId: "",
      accountId: "",
    },
    validationSchema: eventSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      if (!values.dateRange[0] || !values.dateRange[1]) {
        setAlertInfo({
          msg: "Please Choose the Date Range",
          severity: "error",
        });
        setLoading(false);
        action.setSubmitting(false);
        return false;
      }
      if (values.dateRange[0]?.getTime?.() >= values.dateRange[1]?.getTime?.()) {
        setAlertInfo({
          msg: "Invalid Date Range",
          severity: "error",
        });
        setLoading(false);
        action.setSubmitting(false);
        return false;
      }
      const inputValues = {...values};
      const { id: accountId } = router.query;
      if (typeof accountId === "string") {
        inputValues.accountId = accountId;
        const {
          status,
          data,
        } = await fetcher<EventFormSubmit, string>(
          `/api/upsert-event`,
          "POST",
          inputValues,
        );
        if (status === "FAILED") {
          setAlertInfo({
            msg: data,
            severity: "error",
          });
          setLoading(false);
          action.setSubmitting(false);
          return false;
        } else {
          setAlertInfo({
            msg: "Event Added...",
          });
          setLoading(false);
          action.setSubmitting(false);
          await router.push(`/accounts/events/${accountId}`);
          return true;
        }
      }
      setAlertInfo({
        msg: "Something Went Wrong",
        severity: "error",
      });
      setLoading(false);
      action.setSubmitting(false);
      return false;
    },
  });

  if (loading) {
    return <></>;
  }

  if (events.length > 0) {
    return (
      <>
        <EventsList
          events={events}
          username={accountEmail}
          handleBtnClick={() => setOpen(true)}
        />
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar
            sx={{
              position: "relative",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add New Event
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {formik.submitForm()}}
                loading={isLoading}
              >
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <EventCreation
            email={accountEmail}
            handleChange={formik.handleChange}
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
            isSubmitting={formik.isSubmitting}
            handleBlur={formik.handleBlur}
            setFieldValue={formik.setFieldValue}
          />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <NoRecords
        btnName="Add New Event"
        btnClick={() => setOpen(true)}
        title="No events found for this account."
        subTitle={`Please Create a New Event.`}
      />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add New Event
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {formik.submitForm()}}
              loading={isLoading}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <EventCreation
          email={accountEmail}
          handleChange={formik.handleChange}
          values={formik.values}
          touched={formik.touched}
          errors={formik.errors}
          isSubmitting={formik.isSubmitting}
          handleBlur={formik.handleBlur}
          setFieldValue={formik.setFieldValue}
        />
      </Dialog>
    </>
  );
  
};

export default withNavBar(EventsListPage);
