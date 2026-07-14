package com.banking.Banking_system.entity;

import lombok.Getter;

@Getter
public enum Currency {
    INR("India", "₹", 1.00),
    JPY("Japan", "¥", 0.55),
    CNY("China", "¥", 11.50),
    KRW("South Korea", "₩", 0.063),
    THB("Thailand", "฿", 2.40),
    MYR("Malaysia", "RM", 18.90),
    SGD("Singapore", "S$", 63.00),
    BDT("Bangladesh", "৳", 0.72);

    private final String country;
    private final String symbol;
    private final double rateToInr;

    Currency(String country, String symbol, double rateToInr) {
        this.country = country;
        this.symbol = symbol;
        this.rateToInr = rateToInr;
    }

    public static Currency fromCountry(String country) {
        for (Currency c : values()) {
            if (c.getCountry().equalsIgnoreCase(country)) {
                return c;
            }
        }
        return INR; // default
    }
}
