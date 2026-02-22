interface CreditsDisplayProps {
  credits: number;
}

export function CreditsDisplay({ credits }: CreditsDisplayProps) {
  return <h3>Credits: {credits}</h3>;
}