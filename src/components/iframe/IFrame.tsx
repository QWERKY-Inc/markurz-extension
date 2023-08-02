import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React, { PropsWithChildren, useState } from "react";
import { createPortal } from "react-dom";

const IFrame = ({
  children,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLIFrameElement>>) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const cache = createCache({
    key: "css",
    container: contentRef?.contentWindow?.document?.head,
    prepend: true,
  });

  return (
    <iframe {...props} ref={setContentRef}>
      {mountNode &&
        createPortal(
          <CacheProvider value={cache}>{children}</CacheProvider>,
          mountNode,
        )}
    </iframe>
  );
};

export default IFrame;
