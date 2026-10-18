export type ContentKind = "Social caption" | "WhatsApp advert" | "Content calendar" | "Flyer copy" | "Video idea" | "Campaign ideas" | "Rewrite my advert" | "Complete campaign pack";
export type Tone = "Friendly" | "Bold" | "Premium" | "Funny" | "Professional";
export interface GenerateRequest {
  businessName: string;
  businessType: string;
  offer: string;
  audience: string;
  phone: string;
  whatsapp: string;
  location: string;
  platform: string;
  tone: Tone;
  kind: ContentKind;
}