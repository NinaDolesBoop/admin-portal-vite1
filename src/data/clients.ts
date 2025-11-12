export type ClientRecord = {
  id: string;
  name: string;
  email: string;
  status: 'Verified' | 'Suspended' | 'Pending';
  balance: number;
  registrationDate: string; // ISO yyyy-mm-dd
};

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const names = [
  'Nina','Danish','Danish Haiqal','Adlina','Ilham Sofiya','Azalea Azril','Aca','Lola',
  'Luna','Pika','Ryan','Syamil','Khai','Amir','Oyo',
  'Afgan','Billie Eilish','Charles Leclerc','Nina Mizi','Mizi Sharif','Aishah Mohamad','Jack Scott','Ellie Adams',
  'Lola Danish','Bel'
];
const domains = ['yahoo.com','gmail.com'];
const statuses: ClientRecord['status'][] = ['Verified','Suspended','Pending'];

function generateEmail(name: string): string {
  const handle = name.toLowerCase().replace(/[^a-z]/g, '.').replace(/\.+/g, '.');
  return `${handle}@${randomPick(domains)}`;
}

function pad(n: number) { return n.toString().padStart(2, '0'); }

function randomDateInLastYears(years: number): string {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - years);
  const t = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function currency(amount: number): number {
  // cents to dollars with two decimals, returned as number
  return Math.round(amount * 100) / 100;
}

export const clients: ClientRecord[] = Array.from({ length: 120 }).map((_, i) => {
  const name = randomPick(names);
  return {
    id: `c_${i + 1}`,
    name,
    email: generateEmail(name),
    status: randomPick(statuses),
    balance: currency(Math.random() * 10000 - 1000), // allow overdraft
    registrationDate: randomDateInLastYears(3),
  };
});


