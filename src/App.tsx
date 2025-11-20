// src/App.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
                  <ProtectedRoute>
                    <NINStatus />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-methods" 
                element={
                  <ProtectedRoute>
                    <PaymentMethods />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/api-keys" 
                element={
                  <ProtectedRoute>
                    <APIKeys />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transfer" 
                element={
                  <ProtectedRoute>
                    <Transfer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer-care" 
                element={
                  <ProtectedRoute>
                    <CustomerCare />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/confirm-receipt" 
                element={
                  <ProtectedRoute>
                    <ConfirmReceipt />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transaction-preview" 
                element={
                  <ProtectedRoute>
                    <TransactionPreview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reset-pin" 
                element={
                  <ProtectedRoute>
                    <ResetPin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/setup-security" 
                element={
                  <ProtectedRoute>
                    <SetupSecurity />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exam-pins" 
                element={
                  <ProtectedRoute>
                    <ExamPins />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          </WalletProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
