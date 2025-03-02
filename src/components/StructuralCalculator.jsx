import { useState } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function StructuralCalculator({ type }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    // Beam values
    beamLength: '',
    beamWidth: '',
    beamDepth: '',
    mainBarDiameter: '',
    mainBarCount: '',
    stirrupDiameter: '',
    stirrupSpacing: '',
    stirrupCover: '',

    // Column values
    columnLength: '',
    columnWidth: '',
    columnHeight: '',
    colMainBarDiameter: '',
    colMainBarCount: '',
    tieDiameter: '',
    tieSpacing: '',
    tieCover: '',

    // Footing values
    footingLength: '',
    footingWidth: '',
    footingDepth: '',
    barDiameter: '',
    barSpacing: '',

    // Slab values
    slabLength: 0,
    slabWidth: 0,
    slabDepth: 0,
    slabMainBarDiameter: 0,
    slabMainBarSpacing: 0,
    slabDistBarDiameter: 0,
    slabDistBarSpacing: 0
  });

  const [results, setResults] = useState({
    beam: null,
    column: null,
    footing: null,
    slab: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const calculateBeam = () => {
    // Convert dimensions from mm to m and calculate concrete volume
    const length = values.beamLength / 1000;  // mm to m
    const width = values.beamWidth / 1000;    // mm to m
    const depth = values.beamDepth / 1000;    // mm to m
    const concreteVolume = length * width * depth;

    // Calculate main bar weight
    const mainBarWeightPerMeter = Math.pow(values.mainBarDiameter, 2) / 162;  // kg/m
    const mainBarTotalLength = values.mainBarCount * length;  // m
    const mainBarWeight = mainBarWeightPerMeter * mainBarTotalLength;  // kg

    // Calculate stirrup weight
    const stirrupCover = values.stirrupCover / 1000;  // mm to m
    const stirrupWidth = width - 2 * stirrupCover;
    const stirrupDepth = depth - 2 * stirrupCover;
    const stirrupPerimeter = 2 * (stirrupWidth + stirrupDepth);  // m
    const numberOfStirrups = Math.floor(length * 1000 / values.stirrupSpacing) + 1;
    const stirrupTotalLength = numberOfStirrups * stirrupPerimeter;  // m
    const stirrupWeightPerMeter = Math.pow(values.stirrupDiameter, 2) / 162;  // kg/m
    const stirrupWeight = stirrupWeightPerMeter * stirrupTotalLength;  // kg

    // Calculate total steel weight
    const totalSteelWeight = mainBarWeight + stirrupWeight;

    // Calculate steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    setResults(prev => ({
      ...prev,
      beam: {
        concrete: { 
          volume: concreteVolume.toFixed(3), 
          unit: 'm³' 
        },
        steel: { 
          totalWeight: totalSteelWeight.toFixed(2), 
          unit: 'kg',
          percentage: steelPercentage.toFixed(2),
          details: {
            mainBars: mainBarWeight.toFixed(2),
            stirrups: stirrupWeight.toFixed(2)
          }
        }
      }
    }));
  };

  const calculateColumn = () => {
    // Convert dimensions from mm to m and calculate concrete volume
    const length = values.columnLength / 1000;  // mm to m
    const width = values.columnWidth / 1000;    // mm to m
    const height = values.columnHeight / 1000;  // mm to m
    const concreteVolume = length * width * height;

    // Calculate main bar weight
    const mainBarWeightPerMeter = Math.pow(values.colMainBarDiameter, 2) / 162;  // kg/m
    const mainBarTotalLength = values.colMainBarCount * height;  // m
    const mainBarWeight = mainBarWeightPerMeter * mainBarTotalLength;  // kg

    // Calculate tie weight
    const tieCover = values.tieCover / 1000;  // mm to m
    const tieWidth = width - 2 * tieCover;
    const tieLength = length - 2 * tieCover;
    const tiePerimeter = 2 * (tieWidth + tieLength);  // m
    const numberOfTies = Math.floor(height * 1000 / values.tieSpacing) + 1;
    const tieTotalLength = numberOfTies * tiePerimeter;  // m
    const tieWeightPerMeter = Math.pow(values.tieDiameter, 2) / 162;  // kg/m
    const tieWeight = tieWeightPerMeter * tieTotalLength;  // kg

    // Calculate total steel weight
    const totalSteelWeight = mainBarWeight + tieWeight;

    // Calculate steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    setResults(prev => ({
      ...prev,
      column: {
        concrete: { 
          volume: concreteVolume.toFixed(3), 
          unit: 'm³' 
        },
        steel: { 
          totalWeight: totalSteelWeight.toFixed(2), 
          unit: 'kg',
          percentage: steelPercentage.toFixed(2),
          details: {
            mainBars: mainBarWeight.toFixed(2),
            ties: tieWeight.toFixed(2)
          }
        }
      }
    }));
  };

  const calculateFooting = () => {
    // Convert dimensions from mm to m and calculate concrete volume
    const length = values.footingLength / 1000;  // mm to m
    const width = values.footingWidth / 1000;    // mm to m
    const depth = values.footingDepth / 1000;    // mm to m
    const concreteVolume = length * width * depth;

    // Calculate number of bars in each direction based on spacing
    const barsAlongLength = Math.floor(values.footingLength / values.barSpacing) + 1;
    const barsAlongWidth = Math.floor(values.footingWidth / values.barSpacing) + 1;

    // Calculate total length of all bars
    const totalBarLength = (barsAlongLength * width) + (barsAlongWidth * length);  // in meters

    // Calculate steel weight
    const barWeightPerMeter = Math.pow(values.barDiameter, 2) / 162;  // kg/m
    const totalSteelWeight = barWeightPerMeter * totalBarLength;

    // Calculate steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    setResults(prev => ({
      ...prev,
      footing: {
        concrete: { 
          volume: concreteVolume.toFixed(3), 
          unit: 'm³' 
        },
        steel: { 
          totalWeight: totalSteelWeight.toFixed(2), 
          unit: 'kg',
          percentage: steelPercentage.toFixed(2),
          details: {
            barsInLengthDir: barsAlongLength,
            barsInWidthDir: barsAlongWidth,
            totalBarLength: totalBarLength.toFixed(2),
            weightPerMeter: barWeightPerMeter.toFixed(3)
          }
        }
      }
    }));
  };

  const calculateSlab = () => {
    // Convert dimensions from mm to m and calculate concrete volume
    const length = values.slabLength / 1000;  // mm to m
    const width = values.slabWidth / 1000;    // mm to m
    const depth = values.slabDepth / 1000;    // mm to m
    const concreteVolume = length * width * depth;

    // Calculate main bars (along width)
    const mainBarsCount = Math.floor(width * 1000 / values.slabMainBarSpacing) + 1;
    const mainBarLength = length;  // each bar runs full length
    const mainBarTotalLength = mainBarsCount * mainBarLength;
    const mainBarWeightPerMeter = Math.pow(values.slabMainBarDiameter, 2) / 162;
    const mainBarWeight = mainBarWeightPerMeter * mainBarTotalLength;

    // Calculate distribution bars (along length)
    const distBarsCount = Math.floor(length * 1000 / values.slabDistBarSpacing) + 1;
    const distBarLength = width;  // each bar runs full width
    const distBarTotalLength = distBarsCount * distBarLength;
    const distBarWeightPerMeter = Math.pow(values.slabDistBarDiameter, 2) / 162;
    const distBarWeight = distBarWeightPerMeter * distBarTotalLength;

    // Calculate total steel weight
    const totalSteelWeight = mainBarWeight + distBarWeight;

    // Calculate steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    setResults(prev => ({
      ...prev,
      slab: {
        concrete: { 
          volume: concreteVolume.toFixed(3), 
          unit: 'm³' 
        },
        steel: { 
          totalWeight: totalSteelWeight.toFixed(2), 
          unit: 'kg',
          percentage: steelPercentage.toFixed(2),
          details: {
            mainBars: {
              count: mainBarsCount,
              totalLength: mainBarTotalLength.toFixed(2),
              weight: mainBarWeight.toFixed(2),
              weightPerMeter: mainBarWeightPerMeter.toFixed(3)
            },
            distBars: {
              count: distBarsCount,
              totalLength: distBarTotalLength.toFixed(2),
              weight: distBarWeight.toFixed(2),
              weightPerMeter: distBarWeightPerMeter.toFixed(3)
            }
          }
        }
      }
    }));
  };

  const getCalculatorContent = () => {
    switch(type) {
      case 'beam':
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Length (mm)"
                  name="beamLength"
                  type="number"
                  value={values.beamLength}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (mm)"
                  name="beamWidth"
                  type="number"
                  value={values.beamWidth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Depth (mm)"
                  name="beamDepth"
                  type="number"
                  value={values.beamDepth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Main Bar Diameter (mm)"
                  name="mainBarDiameter"
                  type="number"
                  value={values.mainBarDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Main Bar Count"
                  name="mainBarCount"
                  type="number"
                  value={values.mainBarCount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stirrup Diameter (mm)"
                  name="stirrupDiameter"
                  type="number"
                  value={values.stirrupDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stirrup Spacing (mm)"
                  name="stirrupSpacing"
                  type="number"
                  value={values.stirrupSpacing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stirrup Cover (mm)"
                  name="stirrupCover"
                  type="number"
                  value={values.stirrupCover}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={calculateBeam}
                  fullWidth
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
            {results.beam && (
              <Box className="results-container">
                <Typography className="result-item">
                  Concrete Volume: <span className="result-value">{results.beam.concrete.volume} {results.beam.concrete.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Total Steel Weight: <span className="result-value">{results.beam.steel.totalWeight} {results.beam.steel.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Steel Percentage: <span className="result-value">{results.beam.steel.percentage}%</span>
                </Typography>
                <Typography className="result-item" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Details:
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Main Bars: <span className="result-value">{results.beam.steel.details.mainBars} kg</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Stirrups: <span className="result-value">{results.beam.steel.details.stirrups} kg</span>
                </Typography>
              </Box>
            )}
          </>
        );

      case 'column':
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Length (mm)"
                  name="columnLength"
                  type="number"
                  value={values.columnLength}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (mm)"
                  name="columnWidth"
                  type="number"
                  value={values.columnWidth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (mm)"
                  name="columnHeight"
                  type="number"
                  value={values.columnHeight}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Main Bar Diameter (mm)"
                  name="colMainBarDiameter"
                  type="number"
                  value={values.colMainBarDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Main Bars"
                  name="colMainBarCount"
                  type="number"
                  value={values.colMainBarCount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tie Diameter (mm)"
                  name="tieDiameter"
                  type="number"
                  value={values.tieDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tie Spacing (mm)"
                  name="tieSpacing"
                  type="number"
                  value={values.tieSpacing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tie Cover (mm)"
                  name="tieCover"
                  type="number"
                  value={values.tieCover}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={calculateColumn}
                  fullWidth
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
            {results.column && (
              <Box className="results-container">
                <Typography className="result-item">
                  Concrete Volume: <span className="result-value">{results.column.concrete.volume} {results.column.concrete.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Total Steel Weight: <span className="result-value">{results.column.steel.totalWeight} {results.column.steel.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Steel Percentage: <span className="result-value">{results.column.steel.percentage}%</span>
                </Typography>
                <Typography className="result-item" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Details:
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Main Bars: <span className="result-value">{results.column.steel.details.mainBars} kg</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Ties: <span className="result-value">{results.column.steel.details.ties} kg</span>
                </Typography>
              </Box>
            )}
          </>
        );

      case 'footing':
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Length (mm)"
                  name="footingLength"
                  type="number"
                  value={values.footingLength}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (mm)"
                  name="footingWidth"
                  type="number"
                  value={values.footingWidth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Depth (mm)"
                  name="footingDepth"
                  type="number"
                  value={values.footingDepth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bar Diameter (mm)"
                  name="barDiameter"
                  type="number"
                  value={values.barDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bar Spacing (mm)"
                  name="barSpacing"
                  type="number"
                  value={values.barSpacing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={calculateFooting}
                  fullWidth
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
            {results.footing && (
              <Box className="results-container">
                <Typography className="result-item">
                  Concrete Volume: <span className="result-value">{results.footing.concrete.volume} {results.footing.concrete.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Total Steel Weight: <span className="result-value">{results.footing.steel.totalWeight} {results.footing.steel.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Steel Percentage: <span className="result-value">{results.footing.steel.percentage}%</span>
                </Typography>
                <Typography className="result-item" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Details:
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Bars along length: <span className="result-value">{results.footing.steel.details.barsInLengthDir}</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Bars along width: <span className="result-value">{results.footing.steel.details.barsInWidthDir}</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Total bar length: <span className="result-value">{results.footing.steel.details.totalBarLength} m</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Bar weight per meter: <span className="result-value">{results.footing.steel.details.weightPerMeter} kg/m</span>
                </Typography>
              </Box>
            )}
          </>
        );

      case 'slab':
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Length (mm)"
                  name="slabLength"
                  type="number"
                  value={values.slabLength}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (mm)"
                  name="slabWidth"
                  type="number"
                  value={values.slabWidth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Depth (mm)"
                  name="slabDepth"
                  type="number"
                  value={values.slabDepth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Main Bar Diameter (mm)"
                  name="slabMainBarDiameter"
                  type="number"
                  value={values.slabMainBarDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Main Bar Spacing (mm)"
                  name="slabMainBarSpacing"
                  type="number"
                  value={values.slabMainBarSpacing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Distribution Bar Diameter (mm)"
                  name="slabDistBarDiameter"
                  type="number"
                  value={values.slabDistBarDiameter}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Distribution Bar Spacing (mm)"
                  name="slabDistBarSpacing"
                  type="number"
                  value={values.slabDistBarSpacing}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={calculateSlab}
                  fullWidth
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
            {results.slab && (
              <Box className="results-container">
                <Typography className="result-item">
                  Concrete Volume: <span className="result-value">{results.slab.concrete.volume} {results.slab.concrete.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Total Steel Weight: <span className="result-value">{results.slab.steel.totalWeight} {results.slab.steel.unit}</span>
                </Typography>
                <Typography className="result-item">
                  Steel Percentage: <span className="result-value">{results.slab.steel.percentage}%</span>
                </Typography>
                <Typography className="result-item" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Main Bars:
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Number of bars: <span className="result-value">{results.slab.steel.details.mainBars.count}</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Total length: <span className="result-value">{results.slab.steel.details.mainBars.totalLength} m</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Weight: <span className="result-value">{results.slab.steel.details.mainBars.weight} kg</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Weight per meter: <span className="result-value">{results.slab.steel.details.mainBars.weightPerMeter} kg/m</span>
                </Typography>
                <Typography className="result-item" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Distribution Bars:
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Number of bars: <span className="result-value">{results.slab.steel.details.distBars.count}</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Total length: <span className="result-value">{results.slab.steel.details.distBars.totalLength} m</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Weight: <span className="result-value">{results.slab.steel.details.distBars.weight} kg</span>
                </Typography>
                <Typography className="result-item" sx={{ pl: 2 }}>
                  Weight per meter: <span className="result-value">{results.slab.steel.details.distBars.weightPerMeter} kg/m</span>
                </Typography>
              </Box>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'beam': return 'Beam Calculator';
      case 'column': return 'Column Calculator';
      case 'footing': return 'Footing Calculator';
      case 'slab': return 'Slab Calculator';
      default: return '';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Back to Home
        </Button>
        <Paper elevation={3} className="calculator-card" sx={{ p: 4 }}>
          <Typography variant="h5" className="calculator-title">
            {getTitle()}
          </Typography>
          <Box component="form">
            {getCalculatorContent()}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default StructuralCalculator;
