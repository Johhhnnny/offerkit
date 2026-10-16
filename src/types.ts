export type ContentKind = "Social caption" | "WhatsApp advert" | "Content calendar" | "Flyer copy" | "Video idea";
export type Tone = "Friendly" | "Bold" | "Premium" | "Funny" | "Professional";
export interface GenerateRequest {
  businessName: string;
  businessType: string;
  offer: string;
  audience: string;
  platform: string;
  tone: Tone;
  kind: ContentKind;
}