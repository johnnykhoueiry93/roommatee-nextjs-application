// app/tenant/[tenantId]/page.js

"use client";

import { useParams } from 'next/navigation';
import TenantCardDetails from '../../../components/searchTenant/TenantCardDetails'

const Tenant = () => {
  const { tenantId } = useParams(); // Access the listingId from the URL

  return (
    <div>
      <TenantCardDetails tenantId={tenantId}/>
    </div>
  );
};

export default Tenant;
