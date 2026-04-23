package com.vendora.controller;

import com.vendora.cart.dto.CartItemDto;
import com.vendora.cart.dto.CheckoutRequest;
import com.vendora.cart.model.LocationType;
import com.vendora.cart.service.CartService;
import com.vendora.cart.service.DeliveryChargeService;
import com.vendora.model.Order;
import com.vendora.model.User;
import com.vendora.service.OrderService;
import com.vendora.service.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

/**
 * Handles the cart page, AJAX cart updates, and the checkout flow.
 */
@Controller
public class CartController {

    private final CartService cartService;
    private final DeliveryChargeService deliveryChargeService;
    private final UserService userService;
    private final OrderService orderService;

    public CartController(CartService cartService,
                          DeliveryChargeService deliveryChargeService,
                          UserService userService,
                          OrderService orderService) {
        this.cartService = cartService;
        this.deliveryChargeService = deliveryChargeService;
        this.userService = userService;
        this.orderService = orderService;
    }

    // ---------------------------- Cart page ----------------------------

    @GetMapping("/cart")
    public String viewCart(Model model) {
        User user = userService.getCurrentUser();
        List<CartItemDto> items = cartService.listItems(user);
        BigDecimal subtotal = items.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("items", items);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("defaultDeliveryFee", new BigDecimal("500"));
        return "cart";
    }

    /** REST endpoint used by cart.js to refresh the grid after AJAX changes. */
    @GetMapping("/cart/api/items")
    @ResponseBody
    public List<CartItemDto> apiItems() {
        User user = userService.getCurrentUser();
        return cartService.listItems(user);
    }

    /** AJAX +/- quantity update. Returns the updated item DTO. */
    @PostMapping("/cart/update")
    @ResponseBody
    public CartItemDto updateQuantity(@RequestParam Long itemId,
                                      @RequestParam int quantity) {
        User user = userService.getCurrentUser();
        return cartService.updateQuantity(user, itemId, quantity);
    }

    @GetMapping("/cart/remove/{id}")
    public String removeOne(@PathVariable Long id, RedirectAttributes ra) {
        User user = userService.getCurrentUser();
        cartService.removeItem(user, id);
        ra.addFlashAttribute("toast", "Item removed from your cart");
        return "redirect:/cart";
    }

    @PostMapping("/cart/remove-selected")
    public String removeSelected(@RequestParam(name = "itemIds", required = false) List<Long> itemIds,
                                 RedirectAttributes ra) {
        User user = userService.getCurrentUser();
        cartService.removeItems(user, itemIds);
        ra.addFlashAttribute("toast", "Selected items removed");
        return "redirect:/cart";
    }

    // --------------------------- Checkout ---------------------------

    @GetMapping("/checkout")
    public String checkoutPage(@RequestParam(name = "itemIds", required = false) List<Long> itemIds,
                               Model model) {
        User user = userService.getCurrentUser();
        List<CartItemDto> all = cartService.listItems(user);
        List<CartItemDto> selected = all.stream()
                .filter(i -> itemIds == null || itemIds.contains(i.getId()))
                .toList();

        BigDecimal subtotal = selected.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CheckoutRequest form = new CheckoutRequest();
        form.setItemIds(selected.stream().map(CartItemDto::getId).toList());
        form.setLocationType(LocationType.SUBURB);
        form.setPaymentMethod("COD");

        model.addAttribute("items", selected);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("defaultFee", deliveryChargeService.calculate(LocationType.SUBURB));
        model.addAttribute("locations", LocationType.values());
        model.addAttribute("checkoutRequest", form);
        return "checkout";
    }

    @PostMapping("/checkout")
    public String submitCheckout(@Valid @ModelAttribute("checkoutRequest") CheckoutRequest req,
                                 BindingResult br,
                                 Model model,
                                 RedirectAttributes ra) {
        User user = userService.getCurrentUser();
        if (br.hasErrors()) {
            // Re-populate the page with the user's selection
            List<CartItemDto> all = cartService.listItems(user);
            List<CartItemDto> selected = all.stream()
                    .filter(i -> req.getItemIds() != null && req.getItemIds().contains(i.getId()))
                    .toList();
            BigDecimal subtotal = selected.stream()
                    .map(CartItemDto::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            model.addAttribute("items", selected);
            model.addAttribute("subtotal", subtotal);
            model.addAttribute("locations", LocationType.values());
            model.addAttribute("defaultFee", deliveryChargeService.calculate(req.getLocationType()));
            return "checkout";
        }

        BigDecimal deliveryFee = deliveryChargeService.calculate(req.getLocationType());

        // Hand off to the team's OrderService to create the Order, decrement
        // stock, persist the OrderItems and clear the purchased cart items.
        Order order = orderService.createOrder(
                user,
                req.getItemIds(),
                req.getAddress(),
                req.getLocationType().name(),
                deliveryFee,
                req.getPaymentMethod()
        );

        ra.addFlashAttribute("toast",
                "Order #" + order.getId() + " placed successfully!");
        return "redirect:/orders/" + order.getId();
    }
}
