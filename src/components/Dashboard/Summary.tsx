import { Box, Card, Grid, Typography } from "@mui/material";
import { FC } from "react";

interface SummaryProps {
  totalSupersigs: number;
  liveProposalsCount: number;
  totalFunds: string
}

const sxs = {
  criteria: {
    fontWeight: "bold",
    marginBottom: 1.5 
  },
  quantity: {
    fontSize: "1.2rem", fontWeight: "regular"
  }
}

const Summary : FC<SummaryProps> = ({
  totalSupersigs = 0,
  liveProposalsCount = 0,
  totalFunds = '0'
}) => {
  return (    
    <Grid container spacing = {2}>
      {
        [
          { criteria: 'Total Supersigs', quantity: totalSupersigs },
          { criteria: 'Active Proposals', quantity: liveProposalsCount },
          { criteria: 'Total Funds', quantity: totalFunds }
        ].map(({ criteria, quantity }, index) => (
          <Grid item xs = {4} key = {index} >
            <Card sx = {{paddingX: 3, paddingY: 1.5, borderRadius: 2}} variant="outlined">
              <Typography variant="h6" component="div">
                <Box sx = {{ ...sxs.criteria }}>
                  { criteria }
                </Box>
              </Typography>
    
              <Typography component="div">
                <Box sx = {{ ...sxs.quantity}}>
                  { quantity }
                </Box>
              </Typography>
            </Card>
          </Grid>  
        ))
      }
    </Grid>
  )
}

export default Summary;