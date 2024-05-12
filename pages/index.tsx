import "./index.module.css";
// import LogoSVG from "./logo.svg";
import Image from "next/image";
import {Bebas_Neue, Nunito} from "next/font/google";
import "@mantine/core/styles.css";
import { Button, createTheme, MantineProvider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import QuoteRequestForm from "../components/QuoteRequestForm";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const bebas = Bebas_Neue({weight:["400"],subsets:["latin"]})
const nunito = Nunito({weight:["400"],subsets:["latin"]}) 

function App() {
  const [quoteRequest, setQuoteRequest] = useState(false);
  const matches = useMediaQuery("(min-width: 56.25em)");


  const container = {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        delayChildren: 0.5,
      },
    },
    hide: {
      opacity: 0,
      x: 300,
      transition: {
        duration: 1.0,
        delayChildren: 0.5,
      },
    },
  };

  return (
    <MantineProvider theme={theme}>
      <div
        className={nunito.className}
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "url('/background-image.JPG')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          style={{
            color: "white",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <Link href={"/login"}>
          <Image
            priority
            src="/logo.png"
            height={70}
            width={150}
            alt="Follow us on Twitter"
          />
          </Link>
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <AnimatePresence>
            {!quoteRequest ? (
              <motion.div
                key="Landingdiv"
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                  paddingLeft: matches ? 50 : "0",
                  paddingTop: "10%",
                  width: matches ? "50%" : "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: matches ? "flex-start" : "center",
                  flexDirection: "column",
                }}
              >
                <motion.div
                  className={bebas.className}
                  style={{
                    fontSize: matches ? 100 : 40,
                    color: "white",
                  }}
                >
                  {" "}
                  Royal Sounds Ent.{" "}
                </motion.div>
                <motion.div
                  className={nunito.className}
                  style={{
                    fontSize: matches ? 25 : 11,
                    color: "white",
                    textAlign: matches ? "left" : "center",
                    padding: matches ? 0 : 5,
                  }}
                >
                  {" "}
                  Our mission is to bring you an unparalleled selection of
                  entertainment services that cater to every whim and fancy.
                  From the latest in virtual reality escapades to immersive
                  gaming adventures, we provide a gateway to worlds beyond your
                  imagination. Our team of visionary creators and technological
                  wizards work tirelessly to craft experiences that not only
                  entertain but inspire.{" "}
                </motion.div>
                <motion.div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    marginTop: "5%",
                  }}
                >
                  <Button
                    size="md"
                    className={bebas.className}
                    style={{
                      fontSize: matches ? 25 : 20,
                      backgroundColor: "#D9D9D9",
                      color: "#000000",
                    }}
                    onClick={() => {
                      setQuoteRequest(true);
                    }}
                  >
                    {" "}
                    BOOK NOW{" "}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <QuoteRequestForm />
            )}
          </AnimatePresence>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
