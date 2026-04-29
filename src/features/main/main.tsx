import { Container } from "@mantine/core";
import { Form } from "./form";
import { Result } from "./result";
import { useCalculator } from "./use-calculator";

export const Main = () => {
  const {
    savedItem,
    savedEnchants,
    savedOptimizationMode,
    error,
    optimalSteps,
    loading,
    activeStep,
    setActiveStep,
    calculate,
  } = useCalculator();

  return (
    <Container size="800" pt="lg" pb={100}>
      <Form loading={loading} onCalculate={calculate} />
      <Result
        savedItem={savedItem}
        savedEnchants={savedEnchants}
        savedOptimizationMode={savedOptimizationMode}
        error={error}
        optimalSteps={optimalSteps}
        activeStep={activeStep}
        onChangeStep={setActiveStep}
      />
    </Container>
  );
};
