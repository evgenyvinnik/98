import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  { name: 'Windows Default', path: '/desktop/Themes/Windows Official/Windows Default.theme' },
  { name: 'Dangerous Creatures', path: '/desktop/Themes/Windows Official/Dangerous Creatures (256 color).theme' },
  { name: 'Baseball', path: '/desktop/Themes/Windows Official/Baseball (256 color).theme' },
  { name: 'Sports', path: '/desktop/Themes/Windows Official/Sports (256 color).theme' },
  { name: 'Inside your Computer', path: '/desktop/Themes/Windows Official/Inside your Computer (high color).theme' },
  { name: 'Jungle', path: '/desktop/Themes/Windows Official/Jungle (256 color).theme' },
  { name: 'Mystery', path: '/desktop/Themes/Windows Official/Mystery (high color).theme' },
  { name: 'Nature', path: '/desktop/Themes/Windows Official/Nature (high color).theme' },
  { name: 'Science', path: '/desktop/Themes/Windows Official/Science (256 color).theme' },
  { name: 'Space', path: '/desktop/Themes/Windows Official/Space (256 color).theme' },
  { name: 'The 60s USA', path: "/desktop/Themes/Windows Official/The 60's USA (256 color).theme" },
  { name: 'The Golden Era', path: '/desktop/Themes/Windows Official/The Golden Era (high color).theme' },
  { name: 'Travel', path: '/desktop/Themes/Windows Official/Travel (high color).theme' },
  { name: 'Underwater', path: '/desktop/Themes/Windows Official/Underwater (high color).theme' },
  { name: 'Windows 98', path: '/desktop/Themes/Windows Official/Windows 98 (256 color).theme' },
  { name: 'Brick', path: '/desktop/Themes/classicthemes8/Themes/Brick_classic8.theme' },
  { name: 'Desert', path: '/desktop/Themes/classicthemes8/Themes/desert_classic8.theme' },
  { name: 'Eggplant', path: '/desktop/Themes/classicthemes8/Themes/eggplant_classic8.theme' },
  { name: 'Lilac', path: '/desktop/Themes/classicthemes8/Themes/lilac_classic8.theme' },
  { name: 'Maple', path: '/desktop/Themes/classicthemes8/Themes/maple_classic8.theme' },
  { name: 'Marine', path: '/desktop/Themes/classicthemes8/Themes/marine_classic8.theme' },
  { name: 'Plum', path: '/desktop/Themes/classicthemes8/Themes/plum_classic8.theme' },
  { name: 'Pumpkin', path: '/desktop/Themes/classicthemes8/Themes/pumpkin_classic8.theme' },
  { name: 'Rainy Day', path: '/desktop/Themes/classicthemes8/Themes/rainyday_classic8.theme' },
  { name: 'Red, Blue, White', path: '/desktop/Themes/classicthemes8/Themes/redbluewhite_classic8.theme' },
  { name: 'Rose', path: '/desktop/Themes/classicthemes8/Themes/rose_classic8.theme' },
  { name: 'Slate', path: '/desktop/Themes/classicthemes8/Themes/slate_classic8.theme' },
  { name: 'Spruce', path: '/desktop/Themes/classicthemes8/Themes/spruce_classic8.theme' },
  { name: 'Storm', path: '/desktop/Themes/classicthemes8/Themes/storm_classic8.theme' },
  { name: 'Teal', path: '/desktop/Themes/classicthemes8/Themes/teal_classic8.theme' },
  { name: 'Wheat', path: '/desktop/Themes/classicthemes8/Themes/wheat_classic8.theme' },
  { name: 'WinXP', path: '/desktop/Themes/classicthemes8/Themes/winxp_classic8.theme' },
];

const DisplayProperties: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div style={{ padding: '10px' }}>
      <h2>Display Properties</h2>
      <select onChange={(e) => setTheme(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
        {themes.map(theme => (
          <option key={theme.path} value={theme.path}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DisplayProperties;
