import {
  env,
  SELF,
} from "cloudflare:test";

import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockVerifyTurnstile, mockProcessContact } = vi.hoisted(() => ({
  mockVerifyTurnstile: vi.fn(),
  mockProcessContact: vi.fn(),
}));

vi.mock("../src/services/turnstile", () => ({
  verifyTurnstile: mockVerifyTurnstile,
}));

vi.mock("../src/services/contact.service", () => ({
  processContact: mockProcessContact,
}));

import worker from "../src/index";


describe("Bacatinta API", () => {
  beforeEach(() => {
  mockVerifyTurnstile.mockReset();
  mockProcessContact.mockReset();
});

  it("returns 404 for an unknown endpoint (unit style)", async () => {
    const request = new Request(
      "http://example.com/does-not-exist"
    );

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(404);

    const body = await response.json() as {
      success: boolean;
      message: string;
    };

    expect(body.success).toBe(false);
    expect(body.message).toBe("Endpoint not found.");
  });


  it("returns 404 for an unknown endpoint (integration style)", async () => {
    const response = await SELF.fetch(
      "https://example.com/does-not-exist"
    );

    expect(response.status).toBe(404);

    const body = await response.json() as {
      success: boolean;
      message: string;
    };

    expect(body.success).toBe(false);
    expect(body.message).toBe("Endpoint not found.");
  });


  it("rejects contact submission without Turnstile token", async () => {
    const request = new Request(
      "https://example.com/v1/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "Testing contact form",
        }),
      }
    );

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(400);

    const body = await response.json() as {
      success: boolean;
      message: string;
    };

    expect(body.success).toBe(false);
    expect(body.message).toBe("Missing Turnstile token.");
  });

  it("returns 500 when contact processing fails", async () => {
  mockVerifyTurnstile.mockResolvedValue({
    success: true,
  });

  mockProcessContact.mockRejectedValue(
    new Error("Resend API failed")
  );

  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Testing email service failure",
        turnstileToken: "test-token",
      }),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(500);

  const body = await response.json() as {
    success: boolean;
    message: string;
  };

  expect(body.success).toBe(false);
  expect(body.message).toBe("Internal server error.");

  expect(mockVerifyTurnstile).toHaveBeenCalledWith(
    "test-token",
    env
  );

  expect(mockProcessContact).toHaveBeenCalled();
});


  it("rejects invalid contact form data", async () => {
    mockVerifyTurnstile.mockResolvedValue({
      success: true,
    });

    const request = new Request(
      "https://example.com/v1/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          email: "not-an-email",
          message: "",
          turnstileToken: "test-token",
        }),
      }
    );

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(400);

    const body = await response.json() as {
      success: boolean;
      message: string;
      code?: string;
    };

    expect(body.success).toBe(false);
    expect(body.code).toBeDefined();
  });
  it("accepts a valid contact submission", async () => {
  mockVerifyTurnstile.mockResolvedValue({
    success: true,
  });

  mockProcessContact.mockResolvedValue(undefined);

  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Testing successful contact submission",
        turnstileToken: "test-token",
      }),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(200);

  const body = await response.json() as {
    success: boolean;
    message: string;
  };

  expect(body.success).toBe(true);
  expect(body.message).toBe(
    "Message received successfully."
  );

  expect(mockVerifyTurnstile).toHaveBeenCalledWith(
    "test-token",
    env
  );

  expect(mockProcessContact).toHaveBeenCalledWith(
    {
      name: "Test User",
      email: "test@example.com",
      message: "Testing successful contact submission",
      turnstileToken: "test-token",
    },
    env
  );
});

it("rejects contact submission when Turnstile verification fails", async () => {
  mockVerifyTurnstile.mockResolvedValue({
    success: false,
    "error-codes": ["invalid-input-response"],
  });

  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Testing Turnstile rejection",
        turnstileToken: "invalid-token",
      }),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(403);

  const body = await response.json() as {
    success: boolean;
    message: string;
    code?: string;
  };

  expect(body.success).toBe(false);
  expect(body.code).toBeDefined();

  expect(mockVerifyTurnstile).toHaveBeenCalledWith(
    "invalid-token",
    env
  );

  expect(mockProcessContact).not.toHaveBeenCalled();
});
it("allows requests from an approved origin", async () => {
  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:4321",
      },
      body: JSON.stringify({}),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.headers.get("Access-Control-Allow-Origin"))
    .toBe("http://localhost:4321");
});
it("allows the Bacatinta production origin", async () => {
  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://bacatinta.com",
      },
      body: JSON.stringify({}),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.headers.get("Access-Control-Allow-Origin"))
    .toBe("https://bacatinta.com");
});
it("returns the expected CORS policy headers", async () => {
  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://bacatinta.com",
      },
      body: JSON.stringify({}),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.headers.get("Access-Control-Allow-Methods"))
    .toBe("POST, OPTIONS");

  expect(response.headers.get("Access-Control-Allow-Headers"))
    .toBe("Content-Type");

  expect(response.headers.get("Content-Type"))
    .toContain("application/json");
});
it("handles CORS preflight requests", async () => {
  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "OPTIONS",
      headers: {
        "Origin": "https://bacatinta.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(204);

  expect(
    response.headers.get("Access-Control-Allow-Origin")
  ).toBe("https://bacatinta.com");

  expect(
    response.headers.get("Access-Control-Allow-Methods")
  ).toBe("POST, OPTIONS");

  expect(
    response.headers.get("Access-Control-Allow-Headers")
  ).toBe("Content-Type");
});
it("does not allow an unknown origin", async () => {
  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "OPTIONS",
      headers: {
        "Origin": "https://evil-example.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(204);

  expect(
    response.headers.get("Access-Control-Allow-Origin")
  ).not.toBe("https://evil-example.com");
});
it("rejects an oversized contact request", async () => {
  const oversizedMessage = "A".repeat(100_001);

  const request = new Request(
    "https://example.com/v1/contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: oversizedMessage,
        turnstileToken: "test-token",
      }),
    }
  );

  const response = await worker.fetch(request, env);

  expect(response.status).toBe(413);
});

});