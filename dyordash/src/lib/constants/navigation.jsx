import {
	HiOutlineViewGrid,
	HiOutlineQuestionMarkCircle,
	HiOutlineChartSquareBar,
	HiOutlineCog,
	HiOutlineClipboardList,
	HiCurrencyDollar,
	HiOutlineChip,
  } from 'react-icons/hi';
  
  // Function to generate navigation links dynamically based on the current ticker
  // Function to generate navigation links dynamically based on the current ticker
export const generateNavigationLinks = (currentTicker) => {
	const overviewPath = currentTicker ? `/ticker-overview/${currentTicker}` : '/';
  
	return {
	  DASHBOARD_SIDEBAR_LINKS: [
		{
		  key: 'overview',
		  label: 'Overview',
		  path: overviewPath,
		  icon: <HiOutlineViewGrid />,
		},
		{
		  key: 'incomestatement',
		  label: 'Income Statement',
		  path: `/incomestatement/${currentTicker}`,
		  icon: <HiOutlineChartSquareBar />,
		},
		{
		  key: 'cashflow',
		  label: 'Cash Flow',
		  path: `/cashflow/${currentTicker}`,
		  icon: <HiCurrencyDollar />,
		},
		{
		  key: 'balancesheet',
		  label: 'Balance Sheet',
		  path: `/balancesheet/${currentTicker}`,
		  icon: <HiOutlineClipboardList />,
		},
		{
		  key: 'aianalysis',
		  label: 'AI Analysis',
		  path: `/aianalysis/${currentTicker}`,
		  icon: <HiOutlineChip />,
		},
	  ],
	  DASHBOARD_SIDEBAR_BOTTOM_LINKS: [
		{
		  key: 'settings',
		  label: 'Settings',
		  path: '/settings',
		  icon: <HiOutlineCog />,
		},
		{
		  key: 'support',
		  label: 'Help & Support',
		  path: '/support',
		  icon: <HiOutlineQuestionMarkCircle />,
		},
	  ],
	};
  };
  