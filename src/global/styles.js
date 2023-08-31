import { makeStyles } from '@material-ui/core';
const colors = {
  blue: { color: '#3B94FF' },
  ligthBlue: { color: '#4FC3F7' },
  lightGray: { color: '#B4B4B4' },
  gray: { color: '#747474' },
  darkGray: { color: '#626262' },
  green: { color: '#3CB371' },
  yellow: { color: '#FDD835' },
  orange: { color: '#FF7043' },
  black: { color: '#000' },
  white: { color: '#FFF' },
  transparent: { color: 'transparent' },
  lightRed: { color: '#FF7474' },
  red: { color: '#B22222' },
  pink: { color: '#CD6090' },
  purple: { color: '#473C8B' },
};
const backgroundColors = {
  backgroundLightBlue: {
    backgroundColor: colors.ligthBlue.color,
    color: colors.black.color,
  },
  backgroundYellow: {
    backgroundColor: colors.yellow.color,
    color: colors.black.color,
  },
  backgroundOrange: {
    backgroundColor: colors.orange.color,
    color: colors.white.color,
  },
  backgroundGreen: {
    backgroundColor: colors.green.color,
    color: colors.white.color,
  },
  backgroundRed: {
    backgroundColor: colors.red.color,
    color: colors.white.color,
  },
  backgroundTransparent: {
    backgroundColor: colors.transparent.color,
    color: colors.darkGray.color,
  },
  backgroundWhite: {
    backgroundColor: colors.white.color,
  },
};
const margins = {
  margin25: {
    margin: 25,
  },
  marginL: {
    marginLeft: '10px',
  },
  marginT10: {
    width: '100%',
    marginTop: 10,
  },
  marginT15: {
    marginTop: 15,
  },
  marginT30: {
    marginTop: 30,
  },
  marginT30SM: {
    '@media (max-width:780px)': {
      marginTop: 30,
    },
  },
};
const textType = {
  moneyLabel: {
    fontSize: '28px',
    marginTop: '5px',
    fontWeight: 600,
  },
  h1: {
    fontWeight: 700,
    fontSize: '18px',
    textTransform: 'capitalize',
  },
  h2: {
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  small: {
    fontSize: 12,
    fontWeight: 500,
  },
};

export default makeStyles((theme) => ({
  ...colors,
  ...backgroundColors,
  ...margins,
  mediaMinFlexNotFullWidth: {
    '@media (min-width: 600px)': {
      maxWidth: '100%',
      flexBasis: '0 !important',
      flexGrow: '0',
    },
  },
  mediaMaxXSFullWidth: {
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  buttonShadow: {
    boxShadow: 'none',
    '&:hover': {
      background: '#0097FF',
      boxShadow: 'none',
    },
  },
  relative: {
    position: 'relative',
  },
  absoluteCard: {
    position: 'absolute',
    right: '0px',
  },
  imgCardProduct: {
    width: '137px',
    height: '180px',
    objectFit: 'contain',
  },
  fullWidthShrink: {
    flexGrow: 1,
    maxWidth: 'none',
    flexShrink: 1,
  },
  labelSmall: {
    ...textType.small,
    color: colors.lightGray.color,
  },
  labelSmallBold: {
    ...textType.small,
    fontWeight: 600
  },

  roundedButton: {
    marginTop: '20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    color: '#3B94FF',
    border: '1px solid #3B94FF',
    textTransform: 'capitalize',
  },

  paddingL30: {
    paddingLeft: 30,
    '@media (max-width:600px)': {
      paddingLeft: 'none',
    },
  },
  paddingT30: {
    paddingTop: 30,
    '@media (max-width:600px)': {
      paddingTop: 'none',
    },
  },
  borderBottom: {
    borderBottom: '1px solid #ccc',
    paddingBottom: 10,
  },
  borderRight: {
    borderRight: '1px solid #ccc',
    '@media (max-width:600px)': {
      borderRight: 'none',
    },
  },
  borderRightBottomCard: {
    borderRight: '1px solid #ccc',
    '@media (max-width:600px)': {
      borderRight: 'none',
      borderBottom:'1px solid #ccc'
    },
  },
  h1: {
    color: colors.darkGray.color,
    ...textType.h1,
  },
  h2: {
    color: colors.darkGray.color,
    ...textType.h2,
  },
  h2Blue: {
    ...textType.h2,
    color: colors.blue.color,
  },
  label: {
    color: colors.darkGray.color,
    fontSize: '14px',
  },
  moneyLabel: {
    ...textType.moneyLabel,
    color: colors.darkGray.color,
  },
  moneyLabelBlue: {
    ...textType.moneyLabel,
    color: colors.blue.color,
  },
  moneyLabelRed: {
    ...textType.moneyLabel,
    color: colors.lightRed.color,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  gridCardContainer: {
    width: '100%',
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCardContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  gridCenter: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderBottomPadding: {
    borderBottom: '1px solid #DCDCDC',
    paddingBottom: '15px',
  },
  borderBottomMarginPadding: {
    marginTop: '15px',
    borderBottom: '1px solid #DCDCDC',
    paddingBottom: '15px',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  numberRanking: {
    display: 'flex',
    borderRadius: '50%',
    width: '2em',
    height: '2em',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.blue.color,
    color: colors.white.color,
    fontSize: 15,
  },
  noBoxShadow: {
    borderBottom: 0,
  },
  displayInlineFlex: {
    display: 'inline-flex',
  },
  tableRows: {},
}));
