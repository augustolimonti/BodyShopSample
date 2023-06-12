import styled from 'styled-components';

// BUTTONS STYLES
export const BuyNowBtn = styled.button`
  background-color: ${({ theme }) => theme?.color1 || '#A7A2A6'};
`;
export const InfoBtn = styled.button`
  background-color: ${({ theme }) => theme?.color4};
`;
export const UpgradeNowBtn = styled.button`
  color: ${({ theme }) => theme?.color2};
`;
// background-color: ${({ theme }) => theme?.color4};
export const SelectNFTBtn = styled.button`
  border-color: ${({ theme }) => theme?.color1};
  color: ${({ theme }) => theme?.color1};
  &:hover {
    background-color: ${({ theme }) => theme?.color1};
    color: '#fff';
  }
`;
export const CustomBtn = styled.button`
  background-color: ${({ theme, bgColor }) =>
    bgColor ? theme?.[bgColor] : theme?.color4 || '#D2523C'}; //primary-red from tailwind theme
  color: ${({ theme, textColor }) =>
    textColor ? theme?.[textColor] : theme?.color4 || '#fff'}; //primary-red from tailwind theme
`;
// TEXT COLOR
export const P = styled.p`
  color: ${({ theme }) => theme?.color1 || '#D2523C'};
`;

//SIDEBAR NAV STYLES

export const NavItem = styled.li`
&.current{
  color: red;
}
  &.traitShop {
    background-color: ${({ theme }) => theme?.color1};
  }
  &.customize {
    background-color: ${({ theme }) => theme?.color2};
  }
  &.builder {
    background-color: ${({ theme }) => theme?.color3};
  }
  &.mutations {
    background-color: ${({ theme }) => theme?.color4};
  }
  &.slotMachine {
    background-color: ${({ theme }) => theme?.color5};
  }

  .inner-slide {
    background-color: inherit;
  }
`;

//WALLET STYLES

export const WalletWrapper = styled.div`
  background-color: ${({ theme }) => theme?.color4 || '#4e4a4c'};
  color: ${({ theme }) => theme?.color2 || '#f3b54f'};
`;
