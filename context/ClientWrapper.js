// app/components/ClientWrapper.js
'use client';

/**
 * The ClientWrapper is called the SiteWrapper with the use client tag
 * and allowing me to wrap the application in the layout.js
 */

import { SiteWrapper } from "./SiteWrapper";

const ClientWrapper = ({ children }) => {
  return <SiteWrapper>{children}</SiteWrapper>;
};

export default ClientWrapper;