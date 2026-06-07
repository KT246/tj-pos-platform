import { PublicQrPage } from "../../../features/public-business/pages/public-business-pages";

type PageProps = {
  params: Promise<{ qrCode: string }>;
};

export default async function Page({ params }: PageProps) {
  const { qrCode } = await params;

  return <PublicQrPage qrCode={qrCode} />;
}
