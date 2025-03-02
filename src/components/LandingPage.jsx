import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, Button } from '@mui/material';

const calculators = [
  {
    title: 'Beam Calculator',
    description: 'Calculate concrete volume and steel requirements for beams with high precision and detailed analysis.',
    path: '/beam',
    icon: '🏗️'
  },
  {
    title: 'Column Calculator',
    description: 'Accurate calculations for column dimensions, reinforcement, and material requirements.',
    path: '/column',
    icon: '🏛️'
  },
  {
    title: 'Footing Calculator',
    description: 'Design and analyze foundation footings with comprehensive material estimates.',
    path: '/footing',
    icon: '🏢'
  },
  {
    title: 'Slab Calculator',
    description: 'Complete slab analysis with reinforcement calculations and material optimization.',
    path: '/slab',
    icon: '🏗️'
  }
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ my: 8 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" className="main-title" align="left" gutterBottom>
                BLUEPRINT
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'var(--text-gray)', 
                  mb: 4, 
                  maxWidth: '90%',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                Professional structural engineering calculator suite for accurate and efficient calculations of beams, columns, footings, and slabs.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: 'var(--primary-blue)', 
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'var(--primary-blue)',
                    opacity: 0.9,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                Read More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src="/blueprint-illustration.svg" 
                alt="Blueprint" 
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  filter: 'drop-shadow(0 8px 16px rgba(25, 118, 210, 0.1))'
                }} 
              />
            </Grid>
          </Grid>

          <Box className="calculators-section">
            <Typography variant="h3" className="section-title">
              Our Calculators
            </Typography>
            <Grid container spacing={8} sx={{ mt: 8, px: 8 }} className="calculator-grid">
              {calculators.map((calc) => (
                <Grid item xs={12} sm={6} md={6} key={calc.path}>
                  <Paper 
                    elevation={1}
                    className="calculator-card landing-card"
                    onClick={() => navigate(calc.path)}
                    sx={{
                      cursor: 'pointer',
                      p: 3,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '180px',
                      mx: 2,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box className="calculator-icon-container">
                      <Typography className="calculator-icon">
                        {calc.icon}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1 }} className="calculator-title">
                      {calc.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem' }} className="calculator-description">
                      {calc.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;
