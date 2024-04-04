import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import ReactTooltip from 'react-tooltip';

const formatNumber = (num) => {
    if (isNaN(num)) {
      return "N/A"; // Return "N/A" for non-numeric values
    }
  
    if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'B';
    } else if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'M';
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'K';
    } else {
      return num.toLocaleString();
    }
  };
  

const itemDescriptions = {
    'EPS': 'Earnings Per Share (EPS) is a measure of a company\'s net profit divided by the number of its outstanding shares, indicating how much money each share is entitled to.',
    'Interest Expense': 'Interest Expense represents the cost incurred by an entity for borrowed funds, showcasing the financial charges for the use of external funds or debt.',
    'Tax Effect Of Unusual Items': 'This reflects the impact of taxes on unusual or non-recurring items, indicating the tax consequences of events not considered part of regular operations.',
    'Tax Rate For Calcs': 'The Tax Rate For Calcs is the percentage used to calculate the tax impact on various financial components, offering insight into the effective tax rate applied in financial analyses.',
    'Normalized EBITDA': 'Normalized EBITDA adjusts Earnings Before Interest, Taxes, Depreciation, and Amortization for unusual items to provide a clearer picture of ongoing operational profitability.',
    'Net Income From Continuing Operation Net Minority Interest': 'This metric shows the net income generated from ongoing operations, excluding the interests of minority shareholders, focusing on the profits attributable to the parent company.',
    'Reconciled Depreciation': 'Reconciled Depreciation represents the allocated portion of the cost of a company’s fixed assets consumed during the reporting period, adjusted for specific accounting purposes.',
    'Reconciled Cost Of Revenue': 'This is the adjusted cost associated with generating revenue, including the cost of goods sold and other direct costs, after accounting adjustments.',
    'EBITDA': 'Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) measures a company\'s operating performance without the effects of financing and accounting decisions.',
    'EBIT': 'Earnings Before Interest and Taxes (EBIT) is a measure of a firm\'s profit that includes all expenses except interest and income tax expenses.',
    'Net Interest Income': 'Net Interest Income is the difference between the revenue generated from a bank\'s interest-bearing assets and the expenses associated with paying out its interest-bearing liabilities.',
    'Interest Income': 'Interest Income is the revenue earned from deposit investments or other interest-bearing accounts.',
    'Normalized Income': 'Normalized Income refers to profits adjusted for unusual or non-recurring items, providing a better assessment of the company\'s ongoing operational performance.',
    'Net Income From Continuing And Discontinued Operation': 'This includes all net income, combining earnings from both ongoing operations and any discontinued operations.',
    'Total Expenses': 'Total Expenses encompass all costs and expenses associated with a company\'s operations, including cost of goods sold, operating expenses, and non-operating expenses.',
    'Total Operating Income As Reported': 'This is the total income generated from regular business operations as disclosed in the company\'s financial statements, excluding non-operating income and expenses.',
    'Diluted Average Shares': 'Diluted Average Shares account for all potential shares that could be created from convertible securities, offering a "worst-case" scenario for share count.',
    'Basic Average Shares': 'Basic Average Shares represent the number of shares currently issued and outstanding, not accounting for potential dilution from convertible securities.',
    'Diluted EPS': 'Diluted Earnings Per Share calculates EPS using Diluted Average Shares, providing insight into earnings if all convertible securities were exercised.',
    'Basic EPS': 'Basic Earnings Per Share calculates net income divided by the Basic Average Shares, showing earnings available to each outstanding share.',
    'Diluted NI Availto Com Stockholders': 'Net income available to common shareholders, adjusted for the potential dilution that could occur if all dilutive securities were converted to common stock.',
    'Net Income Common Stockholders': 'The profit attributable to common stockholders, reflecting the amount of net earnings that is available to be distributed to holders of common stock.',
    'Net Income': 'Net Income is the total profit of the company after all expenses and taxes have been deducted from revenue.',
    'Net Income Including Noncontrolling Interests': 'This is the net income including the portion attributable to noncontrolling interests, representing the total earnings of the company and its subsidiaries.',
    'Net Income Continuous Operations': 'Reflects the earnings generated from the core operations of the company, excluding the effects of discontinued operations.',
    'Tax Provision': 'Tax Provision is the amount set aside to cover income taxes owed by the company, reflecting the estimated taxes payable for the period.',
    'Pretax Income': 'Pretax Income is the total earnings of the company before taxes have been deducted, indicating the profitability before the fiscal impact.',
    'Other Income Expense': 'Other Income Expense encompasses various non-operational income and expenses not directly related to the core business activities.',
    'Other Non Operating Income Expenses': 'Income and expenses arising from non-core activities, including investments, property sales, or other non-operational sources.',
    'Net Non Operating Interest Income Expense': 'This represents the net amount of non-operating interest income and expenses, showcasing the financial impact of interest not related to the core business operations.',
    'Interest Expense Non Operating': 'Interest Expense Non Operating includes interest expenses that are not directly tied to the principal business activities, such as interest on debt for non-core investments.',
    'Interest Income Non Operating': 'Interest Income Non Operating is the income earned from interest on investments or assets not related to the company’s main business operations.',
    'Operating Income': 'Operating Income is the profit realized from a company’s core business operations, indicating the efficiency and profitability of the core business activities before finance and tax impacts.',
    'Operating Expense': 'Operating Expense comprises all expenditure associated with the day-to-day business operations, including research and development, selling, general and administrative expenses, but excluding the cost of goods sold and non-operating expenses.',
    'Research And Development': 'Research and Development (R&D) expenses are associated with the research and development of the company’s products or services, reflecting the company’s investment in innovation and future growth.',
    'Selling General And Administrative': 'Selling, General, and Administrative (SG&A) expenses include all non-production related costs, encompassing sales expenses, marketing, management salaries, and other administrative expenses.',
    'Gross Profit': 'Gross Profit is the profit a company makes after deducting the costs associated with making and selling its products, or the costs associated with providing its services.',
    'Cost Of Revenue': 'Cost of Revenue refers to the direct costs attributable to the production of the goods sold by a company. This includes the cost of the materials used in creating the good along with the direct labor costs used to produce the good.',
    'Total Revenue': 'Total Revenue is the total amount of income generated by the sale of goods or services related to the company’s primary operations.',
    'Operating Revenue': 'Operating Revenue is the income earned from the company’s core business activities, excluding non-operating revenues like interest income or sales of assets.',
    'Special Income Charges': 'This item represents specific charges related to unusual or extraordinary events impacting the company\'s financials.',
    'Write Off': 'Write Off refers to the elimination of an asset from the company\'s books, typically due to it being considered worthless or not recoverable.',
    'Gain On Sale Of Security': 'This item reflects the profit gained from the sale of securities, such as stocks, bonds, or other financial instruments held by the company as investments.',
    'Net Non Operating Interest Income Expense': 'This figure represents the net amount of interest income and expenses not directly related to the company\'s core business operations.',
    'Total Unusual Items': 'Represents the sum total of all unusual or non-recurring items affecting the company\'s financial statements, including both gains and losses from exceptional events or activities.',
    'Total Unusual Items Excluding Goodwill': 'Similar to Total Unusual Items, this figure represents the sum total of unusual items impacting the financials, but it excludes any effects related to goodwill. This exclusion provides a clearer picture of the company\'s financial performance without the impact of goodwill-related events.'
    };
  

    const IncomeStatementTable = ({ symbol }) => {
        const [data, setData] = useState([]);
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await fetch(`http://127.0.0.1:8000/income-statement-page/${symbol}`);
              const jsonData = await response.json();
      
              const dates = Object.keys(jsonData);
              const items = Object.keys(jsonData[dates[0]]);
      
              const tableData = items.map((item) => {
                const rowData = { Item: item };
                dates.forEach(date => {
                  // Directly assign the value; handling of non-numeric moved to formatNumber
                  rowData[date] = jsonData[date][item];
                });
                return rowData;
              });
      
              setData(tableData);
            } catch (error) {
              console.error('Error fetching income statement data:', error);
            }
          };
      
          fetchData();
        }, [symbol]);
      
        const columns = React.useMemo(
          () => [
            {
              Header: 'Breakdown',
              accessor: 'Item',
            },
            ...Object.keys(data[0] || {}).slice(1).map((date) => ({
              Header: new Date(date).toLocaleDateString('en-GB'),
              accessor: date,
              // Use formatNumber for all cell rendering to handle numeric and "N/A"
              Cell: ({ value }) => formatNumber(value),
            })),
          ],
          [data]
        );
      
        const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
          columns,
          data,
        });
      
        return (
          <div>
            <table {...getTableProps()} className="border-collapse border border-gray-300">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-4 py-2 bg-gray-200 border border-gray-300"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-cyan1">
                      {row.cells.map((cell, index) => {
                        const tooltip = index === 0 ? itemDescriptions[cell.value] : '';
                        return (
                          <td
                            {...cell.getCellProps()}
                            className={`px-4 py-2 border border-gray-300 text-${index === 0 ? 'left' : 'right'}`}
                            title={tooltip}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      };
      
      export default IncomeStatementTable;
