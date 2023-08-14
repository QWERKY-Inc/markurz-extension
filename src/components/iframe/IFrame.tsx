import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React, { PropsWithChildren, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export interface IFrameProps
  extends PropsWithChildren<React.HTMLAttributes<HTMLIFrameElement>> {}

const IFrame = ({ children, ...props }: IFrameProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  /**
   * The cache has to be memoized to avoid recreation, and also because the document can potentially be null on load
   * after the initial injection.
   */
  const cache = useMemo(() => {
    if (contentRef?.contentWindow?.document?.head) {
      return createCache({
        key: "markurz-css",
        container: contentRef?.contentWindow?.document?.head,
        prepend: true,
      });
    }
    return null;
  }, [contentRef?.contentWindow?.document?.head]);

  return (
    <iframe title="markurz-frame" {...props} ref={setContentRef}>
      {mountNode &&
        cache &&
        createPortal(
          <CacheProvider value={cache}>{children}</CacheProvider>,
          mountNode,
        )}
    </iframe>
  );
};

export default IFrame;
