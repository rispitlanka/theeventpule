import { Box, Card, CircularProgress, Divider, Grid, IconButton, Stack } from '@mui/material';
import { supabase } from 'pages/supabaseClient';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { FixedSizeGrid } from 'react-window';
import ChairIcon from "@mui/icons-material/Chair";

export default function BookSeats() {
  const [zonesData, setZonesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchZonesData();
  }, []);

  const fetchZonesData = async () => {
    try {
      const { data, error } = await supabase.from('zones').select('*').eq('screenId', 37);
      if (error) throw error;
      if (data) {
        setZonesData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress color="info" />
        </Box>
      ) : (
        <Card sx={{
          position: 'relative',
          mt: 5,
          mb: 2,
        }}>
          {zonesData.map(zone => (
            <ZoneSeatLayout key={zone.id} zone={zone} />
          ))}

        </Card>
      )}
      <Footer />
    </DashboardLayout>
  );
}

function ZoneSeatLayout({ zone }) {
  const [seatsData, setSeatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSeatsData();
  }, []);

  const fetchSeatsData = async () => {
    try {
      let allSeatsData = [];
      let page = 1;
      const pageSize = 1000; // Supabase limit per request
      let totalPages = Math.ceil(2500 / pageSize); // Total pages needed to fetch 2500 records

      // Fetch data until all records are retrieved or until maximum pages are reached
      while (page <= totalPages) {
        const { data, error } = await supabase.from('seats').select('*').eq('zoneId', zone.id).range((page - 1) * pageSize, page * pageSize - 1);
        if (error) throw error;
        if (data) {
          allSeatsData = allSeatsData.concat(data);
        }
        page++;
      }
      setSeatsData(allSeatsData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const maxRow = Math.max(...seatsData.map(seat => parseInt(seat.row)));
  const maxColumn = Math.max(...seatsData.map(seat => parseInt(seat.column)));

  const calculateTotalHeight = (rowCount, rowHeight) => (rowCount + 1) * rowHeight;
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    setTotalHeight(calculateTotalHeight(maxRow, 55));
  }, [maxRow]);

  const getRowHeadAlphabetic = index => {
    return String.fromCharCode(65 + index);
  };

  return (
    <Stack>
      <MDBox>
        <MDTypography variant="h6" gutterBottom sx={{ ml: 2, mt: 2 }}>
          {zone.name}
        </MDTypography>
        <MDBox p={2}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress color="info" />
            </Box>
          ) : (
            <FixedSizeGrid
              columnCount={maxColumn + 1}
              columnWidth={40}
              rowCount={maxRow + 1}
              rowHeight={55}
              width={1600}
              height={totalHeight}
            >
              {({ columnIndex, rowIndex, style }) => {
                const isHeaderRow = rowIndex === 0;
                const isHeaderColumn = columnIndex === 0;

                if (isHeaderRow && isHeaderColumn) {
                  return <div style={style}></div>;
                }

                const columnHead = columnIndex.toString();
                const rowHead = rowIndex.toString();
                const rowHeadAlphabetic = getRowHeadAlphabetic(rowIndex - 1);

                const seat = seatsData.find(
                  seat => seat.row === rowHead && seat.column === columnHead
                );
                const seatName = seat ? seat.seatName : '';

                return (
                  <div
                    style={{
                      ...style,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isHeaderRow ? (
                      <MDTypography variant="body2">{columnHead}</MDTypography>
                    ) : isHeaderColumn ? (
                      <MDTypography variant="body2">{rowHeadAlphabetic}</MDTypography>
                    ) : (
                      <Grid container direction="column" alignItems="center" spacing={0}>
                        {seat && (
                          <>
                            <IconButton size="small">
                              <ChairIcon style={{ color: 'green' }} />
                            </IconButton>
                            <MDTypography variant="body2">{seatName}</MDTypography>
                          </>
                        )}
                      </Grid>
                    )}
                  </div>
                );
              }}
            </FixedSizeGrid>
          )}
        </MDBox>
      </MDBox>
      <Divider sx={{ height: 2 }} />
    </Stack>
  );
}

ZoneSeatLayout.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

