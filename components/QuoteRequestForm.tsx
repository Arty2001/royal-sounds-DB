import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import TextField from "@mui/material/TextField";
import {
  createTheme,
  ThemeProvider,
  Theme,
  useTheme,
} from "@mui/material/styles";
import {
  Button,
  Chip,
  FormControl,
  GlobalStyles,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { IconMailForward, IconCheck, IconX } from "@tabler/icons-react";
import emailjs from "@emailjs/browser";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { ChipSelect } from "./ChipSelect";
import { Bebas_Neue, Nunito } from "next/font/google";

const bebas = Bebas_Neue({weight:["400"],subsets:["latin"]})
const nunito = Nunito({weight:["400"],subsets:["latin"]}) 


export default function QuoteRequestForm() {
  const matches = useMediaQuery("(min-width: 56.25em)"); // if this is true it is desktop, if it isn't it is
  const containerAnimations = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    },
  };


  const customTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: "dark",
        primary: {
          main: "#ffffff",
        },
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#E0E3E7",
              "--TextField-brandBorderHoverColor": "#B2BAC2",
              "--TextField-brandBorderFocusedColor": "#6F7E8C",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              backgroundColor: "#0C0C0C",
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              ...nunito.style,
              color: "#FFFFFF"
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              backgroundColor: "#0C0C0C",
              color: "#FFFFFF",
              "&::before, &::after": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            root: {
              backgroundColor: "#0C0C0C",
              color: "#FFFFFF",
              "&::before, &::after": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
      box-sizing: border-box;
      width: 100%;
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      resize: none;
      color: white ;
      background-color: ${"#0C0C0C"};
      border-bottom: 2px solid #FFFFFF; 
      border-right: 0px;
      border-left: 0px;
      border-top: 0px; 
  
      &:focus {
        border-color: 'white';
      }
  
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
  );

  const outerTheme = useTheme();
  const [message, setMessage] = React.useState<string|null >();
  const [name, setName] = React.useState<string >('');
  const [address, setAddress] = React.useState<string >('');
  const [phoneNumber, setPhoneNumber] = React.useState<string >('');
  const [emailAddress, setEmailAddress] = React.useState<string >('');
  const [send, setSend] = React.useState<string >("SEND");

  const [eventType, setEventType] = React.useState<string>('');
  const [venueLocation, setVenueLocation] = React.useState<string>('');

  const [eventDescription, setEventDescription] = React.useState<
    string
  >('');

  const [sendStatus, setSendStatus] = React.useState<boolean>(false);

  const [dateTime, setDateTime] = React.useState<Dayjs>(dayjs());
  const [endDateTime, setEndDateTime] = React.useState<Dayjs>(dayjs());

  const [speaker, setSpeaker] = React.useState(true);
  const [BL, setBL] = React.useState(true);
  const [DI, setDI] = React.useState(true);
  const [DL, setDL] = React.useState(false);
  const [sparkler, setSparkler] = React.useState(false);
  const [projector, setProjector] = React.useState(false);
  const [MC, setMC] = React.useState(false);
  const [photobooth, setPhotobooth] = React.useState(false);

  interface Quote {
    name: string;
    homeAddress: string;
    phoneNumber: string;
    emailAddress: string;
    eventType: string;
    venueLocation: string;
    eventDate: string;
    eventStartTime: string;
    eventEndTime: string;
    eventDescription: string;
    extras: {
      speakers: number;
      basicLighting: number;
      dryIce: number;
      DMXLighting: number;
      sparklers: number;
      projectors: number;
      MC: number;
      photoBooth: number;
    };
  }

  async function sendtoDataBase(){
    const quote : Quote={
      name: name,
      homeAddress:address,
      phoneNumber:phoneNumber,
      emailAddress:emailAddress,
      eventType:eventType,
      venueLocation:venueLocation,
      eventDate: dateTime?.format("DD/MM/YYYY"),
      eventStartTime: dateTime?.format("HH:MM"),
      eventEndTime:endDateTime?.format("HH:MM"),
      eventDescription,
      extras:{
        speakers: speaker ? 1:0,
        basicLighting: BL ? 1:0,
        dryIce: DI ? 1:0,
        DMXLighting: DL ? 1:0,
        sparklers: sparkler? 1:0,
        projectors: projector?1:0,
        MC: MC?1:0,
        photoBooth: photobooth?1:0,
      }
    }
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });
  
      if (!response.ok) {
        const errorMessage = `Error: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log('Quote added successfully:', data);
    } catch (error) {
      console.error('Error posting quote:', error);
    }
  
  }

  React.useEffect(() => {
    setMessage(null);
  }, [
    name,
    eventDescription,
    dateTime,
    speaker,
    address,
    phoneNumber,
    emailAddress,
    eventType,
    venueLocation,
    BL,
    DI,
    DL,
    sparkler,
    projector,
    MC,
    photobooth,
  ]);

  const handleEventTypeChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value as string);
  };

  const sendEmail = (e: any) => {
    e.preventDefault();

    let extrasHtml = " ";

    if (
      name.trim() === '' ||
  eventDescription.trim() === '' ||
  address.trim() === '' ||
  phoneNumber.trim() === '' ||
  emailAddress.trim() === '' ||
  eventType.trim() === '' ||
  venueLocation.trim() === ''
    ) {
      setMessage("FILL ALL FIELDS !");
      return;
    }

    sendtoDataBase();
    setSend("SENDING...");

    if (speaker) extrasHtml += "<li>Speakers</li>";
    if (BL) extrasHtml += "<li>Basic Lighting</li>";
    if (DI) extrasHtml += "<li>Dry-Ice</li>";
    if (DL) extrasHtml += "<li>DMX Lighting</li>";
    if (sparkler) extrasHtml += "<li>Sparklers</li>";
    if (projector) extrasHtml += "<li>Projectors</li>";
    if (MC) extrasHtml += "<li>MC</li>";
    if (photobooth) extrasHtml += "<li>Photobooth</li>";

    emailjs
      .send(
        "service_hm2mojg",
        "template_t56vd1t",
        {
          user_name: name,
          user_address: address,
          user_phone: phoneNumber,
          user_email: emailAddress,
          event_type: eventType,
          event_location: venueLocation,
          event_date: dateTime?.format("DD/MM/YYYY"),
          event_time: dateTime?.format("HH:mm"),
          event_end_time: endDateTime?.format("HH:mm"),
          event_description: eventDescription,
          event_extras: extrasHtml,
        },
        {
          publicKey: "PS55Fsn6x1mMr4I75",
        }
      )
      .then(
        () => {
          setMessage(" SENT !");
          setSendStatus(true);
        },
        (error: any) => {
          setMessage("Incorrect Email.");
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GlobalStyles
          styles={{
            ".MuiFilledInput-input:-webkit-autofill": {
              "-webkit-box-shadow": "0 0 0 100px #0C0C0C inset !important",
              "-webkit-text-fill-color": "#ffffff !important",
              borderRadius: "0px !important",
            },
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {sendStatus ? (
            <motion.div
              key="SentDiv"
              variants={containerAnimations}
              initial="hidden"
              animate="show"
              style={{
                backgroundColor: "black",
                height: "auto",
                maxWidth: 750,
                width: "50%",
                minWidth: 350,
                margin: "auto",
                borderRadius: 10,
                paddingRight: 15,
                paddingLeft: 15,
                paddingTop: 15,
                marginTop:'auto',
                paddingBottom: 30,
              }}
            >
              <div
                className={bebas.className}
                style={{
                  fontSize: matches ? 30 : 15,
                  color: "white",
                }}
              >
                Thank you for reaching out!
              </div>
              <div
                className={nunito.className}
                style={{
                  fontSize: matches ? 15 : 11,
                  color: "white",
                  textAlign: "left",
                  padding: matches ? 0 : 5,
                }}
              >
                We've received your request and will get back to you shortly with your personalized quote. In the meantime, feel free to explore more of our instagram. Have a great day!
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="Quotediv"
              variants={containerAnimations}
              initial="hidden"
              animate="show"
              style={{
                backgroundColor: "black",
                height: "auto",
                maxWidth: 750,
                width: "50%",
                minWidth: 350,
                margin: "auto",
                borderRadius: 10,
                paddingRight: 15,
                paddingLeft: 15,
                paddingTop: 15,
                paddingBottom: 30,
              }}
            >
              <div
                className={bebas.className}
                style={{
                  fontSize: matches ? 30 : 15,
                  color: "white",
                }}
              >
                Request A Quote Now!
              </div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>
                <div
                  className={nunito.className}
                  style={{
                    fontSize: matches ? 15 : 11,
                    color: "white",
                    textAlign: "left",
                    padding: matches ? 0 : 5,
                  }}
                >
                  Once submitted, our team will process your request promptly,
                  and you can expect to receive a tailored quote within the next
                  2-3 business days.
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    className={nunito.className}
                    style={{ color: "white" }}
                  >
                    {" "}
                    -- Client Information --{" "}
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <TextField
                    size="small"
                    label="Name"
                    variant="filled"
                    fullWidth
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                    }}
                  />
                </div>
                <div style={{ marginTop: 5 }}>
                  <TextField
                    size="small"
                    label="Home Address"
                    variant="filled"
                    fullWidth
                    value={address}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setAddress(event.target.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    gap: 5,
                    marginTop: 5,
                  }}
                >
                  <TextField
                    size="small"
                    label="Phone Number"
                    variant="filled"
                    fullWidth
                    value={phoneNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setPhoneNumber(event.target.value);
                    }}
                  />
                  <TextField
                    size="small"
                    label="Email Address"
                    variant="filled"
                    fullWidth
                    value={emailAddress}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setEmailAddress(event.target.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    className={nunito.className}
                    style={{ color: "white" }}
                  >
                    {" "}
                    -- Event Description --{" "}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <FormControl
                    variant="filled"
                    sx={{
                      width: "100%",
                      height: 48,
                      borderBottom: "2px solid white",
                    }}
                  >
                    <InputLabel id="demo-simple-select-filled-label">
                      Event Type
                    </InputLabel>
                    <Select
                      style={{
                        height: 46,
                      }}
                      value={eventType}
                      label=" Event Type"
                      onChange={handleEventTypeChange}
                    >
                      <MenuItem value="Wedding Ceremony">
                        {" "}
                        Wedding Ceremony
                      </MenuItem>
                      <MenuItem value="Anniversary">Anniversary</MenuItem>
                      <MenuItem value="Puberty Ceremony">
                        Puberty Ceremony
                      </MenuItem>
                      <MenuItem value="Birthday Party">Birthday Party</MenuItem>
                      <MenuItem value="Wedding Reception">
                        Wedding Reception
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    label="Venue Location"
                    variant="filled"
                    fullWidth
                    value={venueLocation}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setVenueLocation(event.target.value);
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <DatePicker
                    slotProps={{
                      textField: { variant: "filled", fullWidth: true },
                    }}
                    label="Event Date"
                    value={dateTime}
                    onChange={(newValue: Dayjs | null) => newValue && setDateTime(newValue)}
                  />
                </div>
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    gap: 5,
                    marginTop: 5,
                  }}
                >
                  <TimePicker
                    slotProps={{
                      textField: { variant: "filled", fullWidth: true },
                    }}
                    label="Event Start Time"
                    value={dateTime}
                    onChange={(newValue:Dayjs|null) => newValue && setDateTime(newValue)}
                  />
                  <TimePicker
                    slotProps={{
                      textField: { variant: "filled", fullWidth: true },
                    }}
                    label="Event End Time"
                    value={endDateTime}
                    onChange={(newValue:Dayjs|null) => newValue && setEndDateTime(newValue)}
                  />
                </div>
                <div style={{ display: "flex", width: "100%", marginTop: 5 }}>
                  <Textarea
                    className={nunito.className}
                    style={{
                      color: "white",
                      marginTop: 5,
                    }}
                    minRows={5}
                    placeholder="Event Description"
                    defaultValue={eventDescription}
                    onBlur={(ev) => {
                      setEventDescription(ev.target.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    className={nunito.className}
                    style={{ color: "white"}}
                  >
                    {" "}
                    -- Extras --{" "}
                  </div>
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    maxWidth: "100%",
                    flexWrap: "wrap",
                    gap: 5,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                >
                  <Chip
                    variant={speaker ? "filled" : "outlined"}
                    size="small"
                    color={speaker ? "primary" : "default"}
                    label="Speakers"
                    icon={speaker ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setSpeaker((prev) => {
                        return !prev;
                      });
                    }}
                    onDelete={() => {}}
                    deleteIcon={<ChipSelect options={[]} />}
                    style={{
                      ...nunito.style,
                      paddingRight: 5,
                    }}
                  />
                  <Chip
                    variant={BL ? "filled" : "outlined"}
                    size="small"
                    color={BL ? "primary" : "default"}
                    label="Basic Lighting"
                    icon={BL ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setBL((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={DI ? "filled" : "outlined"}
                    size="small"
                    color={DI ? "primary" : "default"}
                    label="Dry-Ice"
                    icon={DI ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setDI((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={DL ? "filled" : "outlined"}
                    size="small"
                    color={DL ? "primary" : "default"}
                    label="DMX Lighting"
                    icon={DL ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setDL((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={sparkler ? "filled" : "outlined"}
                    size="small"
                    color={sparkler ? "primary" : "default"}
                    label="Sparklers"
                    icon={sparkler ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setSparkler((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={projector ? "filled" : "outlined"}
                    size="small"
                    color={projector ? "primary" : "default"}
                    label="Projectors"
                    icon={projector ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setProjector((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={MC ? "filled" : "outlined"}
                    size="small"
                    color={MC ? "primary" : "default"}
                    label="MC *"
                    icon={MC ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setMC((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                  <Chip
                    variant={photobooth ? "filled" : "outlined"}
                    size="small"
                    color={photobooth ? "primary" : "default"}
                    label="Photo booth *"
                    icon={photobooth ? <IconCheck /> : <IconX />}
                    onClick={() => {
                      setPhotobooth((prev) => {
                        return !prev;
                      });
                    }}
                    style={nunito.style}
                  />
                </div>
                <div 
                  className={nunito.className}
                  style={{
                    color: "white",
                    fontSize: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginTop: 20,
                  }}
                >
                  * Partner Recommendation
                </div>
                <div
                  className={nunito.className}
                  style={{
                    color: "white",
                    justifyContent: "right",
                    alignItems: "center",
                    display: "flex",
                    width: "100%",
                    fontSize: 10,
                    marginTop: 20,
                  }}
                >
                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className={bebas.className}
                        style={{
                          fontSize: 20,
                          marginRight: 10,
                        }}
                      >
                        {message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    style={{ ...bebas.style, fontSize: 20 }}
                    variant="outlined"
                    startIcon={<IconMailForward />}
                    onClick={sendEmail}
                  >
                    {send}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
