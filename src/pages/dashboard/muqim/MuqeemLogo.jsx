import logoUrl from './assets/muqeem-logo.png';

/** Logo bitmap cropped from the source PDF for exact brand match */
export default function MuqeemLogo() {
  return <img src={logoUrl} alt="مقيم Muqeem" draggable={false} />;
}
