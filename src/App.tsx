import React from "react";
import MarkurzFab from "src/components/MarkurzFab";
import "./MuiClassNameSetup";

function App() {
  // const [title, setTitle] = React.useState("");

  // function setDocTitle() {
  // console.log("current title", document.title);
  // document.title = "My lame title!";
  // }

  // React.useEffect(() => {
  //   /**
  //    * We can't use "chrome.runtime.sendMessage" for sending messages from React.
  //    * For sending messages from React we need to specify which tab to send it to.
  //    */
  //   chrome.tabs &&
  //     chrome.tabs.query(
  //       {
  //         active: true,
  //         currentWindow: true,
  //       },
  //       (tabs) => {
  //         chrome.scripting.executeScript({
  //           target: { tabId: tabs[0].id || 0 },
  //           func: setDocTitle,
  //         });
  //         /**
  //          * Sends a single message to the content script(s) in the specified tab,
  //          * with an optional callback to run when a response is sent back.
  //          *
  //          * The runtime.onMessage event is fired in each content script running
  //          * in the specified tab for the current extension.
  //          */
  //         chrome.tabs.sendMessage(
  //           tabs[0].id || 0,
  //           { type: "GET_DOM" } as DOMMessage,
  //           (response: DOMMessageResponse) => {
  //             console.log("response", response);
  //             setTitle(response.title);
  //           }
  //         );
  //       }
  //     );
  // });

  return <MarkurzFab />;
}

export default App;
