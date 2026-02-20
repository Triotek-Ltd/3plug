import { useNavbar } from "@/contexts/NavbarContext";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/router.js";
import { toTitleCase } from "@/utils/textConvert.js";
import DocumentDetail from "@/components/pages/detail/DocumentDetail.js";

const PageDocumentDetail = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden, setSidebarWidth } = useSidebar();
  const router = useRouter();
  const {
    CustomHeader,
    CustomBody,
    CustomFooter,
    AppendBeforeBody,
    AppendAfterBody,
    body,
    header,
    footer,
  } = DetailComponents;

  useEffect(() => {
    const pathParts = router.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) {
      updateDashboardText(toTitleCase(pathParts[1]));
      updatePagesText(toTitleCase(pathParts[0]));
    } else if (pathParts.length === 1) {
      updateDashboardText(toTitleCase(pathParts[0]));
    }
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, [
    router.pathname,
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    setSidebarHidden,
  ]);

  const currentPath = router.pathname;
  const getPathWithoutId = (path) => {
    const pathWithoutId = path.substring(1).split("/").slice(0, -1).join("/");
    return pathWithoutId;
  };

  const endpoint = getPathWithoutId(currentPath);

  const documentDetailConfig = {
    endpoint: endpoint,
    settings: settings,
    fields: fields,
  };

  return (
    <div>
      <DocumentDetail
        config={documentDetailConfig}
        body={body}
        header={header}
        footer={footer}
        CustomDocHeader={CustomHeader}
        CustomDocFooter={CustomFooter}
        CustomDocBody={CustomBody}
        AppendBeforeBody={AppendBeforeBody}
        AppendAfterBody={AppendAfterBody}
      />
    </div>
  );
};

export default PageDocumentDetail;
