export interface StatePath {
  id: string;
  name: string;
  path: string;
  labelPosition: { x: number; y: number };
}

export const MAP_PATHS: StatePath[] = [
  {
    id: 'arunachal',
    name: 'Arunachal Pradesh',
    path: 'M 400 50 L 550 50 L 700 100 L 750 200 L 650 250 L 550 200 L 450 150 Z',
    labelPosition: { x: 550, y: 130 }
  },
  {
    id: 'assam',
    name: 'Assam',
    path: 'M 250 250 L 450 150 L 550 200 L 650 250 L 600 350 L 450 300 L 350 400 L 250 350 Z',
    labelPosition: { x: 450, y: 250 }
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    path: 'M 650 250 L 750 200 L 780 300 L 680 350 L 600 350 Z',
    labelPosition: { x: 680, y: 280 }
  },
  {
    id: 'manipur',
    name: 'Manipur',
    path: 'M 600 350 L 680 350 L 650 450 L 550 450 Z',
    labelPosition: { x: 610, y: 400 }
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    path: 'M 550 450 L 650 450 L 600 600 L 500 550 L 450 450 Z',
    labelPosition: { x: 550, y: 500 }
  },
  {
    id: 'tripura',
    name: 'Tripura',
    path: 'M 350 400 L 450 450 L 500 550 L 350 500 L 300 450 Z',
    labelPosition: { x: 400, y: 470 }
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    path: 'M 250 350 L 350 400 L 450 300 L 300 280 Z',
    labelPosition: { x: 330, y: 320 }
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    path: 'M 150 100 L 200 80 L 220 150 L 170 180 Z',
    labelPosition: { x: 180, y: 130 }
  }
];
