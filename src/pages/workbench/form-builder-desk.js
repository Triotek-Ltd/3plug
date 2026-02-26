import { useEffect } from "react";
import { useRouter } from "next/router";

export default function FormBuilderDeskRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/workbench/form-builder");
  }, [router]);
  return null;
}
